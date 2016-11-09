import { assert } from 'chai';
import * as map from '../index';

describe('When Creating a Map', () => {
  it('Can create a map with a single property', () => {
    const map1 = map.create({
      item1: map.to('item1'),
    });
    assert.property(
      map1, 'shape'
    );
    assert.property(
      map1.shape, 'item1'
    );
    assert.property(
      map1, 'literals'
    );
    assert.deepEqual(
      map1.literals, {}
    );
  });
  it('Can create a map with a literal', () => {
    const map1 = map.create({}, {
      item2: 'value',
    });
    assert.property(
      map1, 'literals'
    );
    assert.deepEqual(
      map1.literals, {
        item2: 'value',
      }
    );
  });
  it('Can extend existing shape and add a property', () => {
    const map1 = map.create({
      item1: map.to('item1'),
    });
    const map2 = map.create({
      item2: map.to('item2'),
    });
    const map3 = map.combine(map1, map2);
    assert.property(
      map3, 'shape'
    );
    assert.property(
      map3, 'literals'
    );
    assert.property(
      map3.shape, 'item1'
    );
    assert.property(
      map3.shape, 'item2'
    );
  });
  it('Can extend existing shape with literals', () => {
    const map1 = map.create({}, {
      item1: 'value1',
    });
    const map2 = map.create({}, {
      item2: 'value2',
    });
    const map3 = map.combine(map1, map2);
    assert.property(
      map3, 'literals'
    );
    assert.property(
      map3.literals, 'item1'
    );
    assert.property(
      map3.literals, 'item2'
    );
  });
  describe('when mapping data through a map', () => {
    it('Single Property is mapped', () => {
      const map1 = map.create({
        item1: map.to('ItemOne'),
      });
      const result = map.run({
        item1: 'Value',
      }, map1);
      assert.property(
        result, 'ItemOne'
      );
      assert.equal(
        result.ItemOne,
        'Value'
      );
    });
  });
  describe('When mapping an Array through a map', () => {
    it('All items are mapped individually', () => {
      const adapter = map.create({
        item1: map.to('ItemOne'),
        item2: map.to('ItemTwo'),
      });
      const data = [{
        item1: 'Hello',
        item2: 'World',
      }, {
        item2: 'Bar',
        item1: 'Foo',
      }];
      const result = map.run(data, adapter);

      assert.lengthOf(
        result,
        2
      );

      assert.equal(
        result[0].ItemOne,
        'Hello',
      );
      assert.equal(
        result[0].ItemTwo,
        'World',
      );
    });
  });
  describe('When using a converter on a map', () => {
    it('If Parent and children are arrays then all items are mapped individually', () => {
      const childadapter = map.create({
        item1: map.to('ItemOne'),
        item2: map.to('ItemTwo'),
      });
      const adapter = map.create({
        parent: map.to('Parent').with(childadapter),
      });
      const data = [{
        parent: [{
          item1: 'Hello',
          item2: 'World',
        }, {
          item2: 'Bar',
          item1: 'Foo',
        }],
      }, {
        parent: [{
          item1: 'Hello2',
          item2: 'World2',
        }, {
          item2: 'Bar2',
          item1: 'Foo2',
        }],
      }];
      const result = map.run(data, adapter);

      assert.lengthOf(
        result,
        2
      );
      assert.lengthOf(
        result[0].Parent,
        2
      );
      assert.equal(
        result[0].Parent[0].ItemOne,
        'Hello',
      );
      assert.equal(
        result[0].Parent[0].ItemTwo,
        'World',
      );
    });
    it('If item is an array then all items are mapped individually', () => {
      const childadapter = map.create({
        item1: map.to('ItemOne'),
        item2: map.to('ItemTwo'),
      });
      const adapter = map.create({
        parent: map.to('Parent').with(childadapter),
      });
      const data = {
        parent: [{
          item1: 'Hello',
          item2: 'World',
        }, {
          item2: 'Bar',
          item1: 'Foo',
        }],
      };
      const result = map.run(data, adapter);

      assert.lengthOf(
        result.Parent,
        2
      );

      assert.equal(
        result.Parent[0].ItemOne,
        'Hello',
      );
      assert.equal(
        result.Parent[0].ItemTwo,
        'World',
      );
    });
    it('Function converter is executed', () => {
      const converter = (data) => `${data}:Converted`;
      const map1 = map.create({
        item1: map.to('ItemOne').with(converter),
      });
      const result = map.run({
        item1: 'Value',
      }, map1);
      assert.property(
        result, 'ItemOne'
      );
      assert.equal(
        result.ItemOne,
        'Value:Converted'
      );
    });
    it('Converter that returns adapter is used', () => {
      const converter = map.create({
        item2: map.to('ItemTwo'),
      });
      const map1 = map.create({
        item1: map.to('ItemOne').with(converter),
      });
      const result = map.run({
        item1: {
          item2: 'Value',
        },
      }, map1);
      assert.property(
        result, 'ItemOne'
      );
      assert.property(
        result.ItemOne, 'ItemTwo'
      );
      assert.equal(
        result.ItemOne.ItemTwo,
        'Value'
      );
    });
    it('Converter that is a function that returns an adapter is used', () => {
      const converter = () => map.create({
        item2: map.to('ItemTwo'),
      });
      const map1 = map.create({
        item1: map.to('ItemOne').with(converter),
      });
      const result = map.run({
        item1: {
          item2: 'Value2',
        },
      }, map1);
      assert.property(
        result, 'ItemOne'
      );
      assert.property(
        result.ItemOne, 'ItemTwo'
      );
      assert.equal(
        result.ItemOne.ItemTwo,
        'Value2'
      );
    });
  });
  describe('When mapping a child array', () => {
    it('items are mapped individually', () => {
      const child = map.create({
        item2: map.to('ItemTwo'),
      });
      const map1 = map.create({
        item1: map.to('ItemOne').each.with(child),
      });
      const result = map.run({
        item1: [{
          item2: 1,
        }, {
          item2: 2,
        }],
      }, map1);
      assert.property(
        result,
        'ItemOne'
      );
      assert.isArray(result.ItemOne);
      assert.lengthOf(result.ItemOne, 2);
      assert.property(
        result.ItemOne[0],
        'ItemTwo'
      );
      assert.equal(
        result.ItemOne[0].ItemTwo,
        1
      );
      assert.property(
        result.ItemOne[1],
        'ItemTwo'
      );
      assert.equal(
        result.ItemOne[1].ItemTwo,
        2
      );
    });
  });
  describe('when mapping data through an extended map', () => {
    it('Two properties are mapped', () => {
      const map1 = map.create({
        item1: map.to('ItemOne'),
      });
      const map2 = map.create({
        item2: map.to('ItemTwo'),
      });
      const combined = map.combine(map1, map2);
      const result = map.run({
        item1: 'Value1',
        item2: 'Value2',
      }, combined);
      assert.property(
        result, 'ItemOne'
      );
      assert.property(
        result, 'ItemTwo'
      );
      assert.equal(
        result.ItemOne,
        'Value1'
      );
      assert.equal(
        result.ItemTwo,
        'Value2'
      );
    });
    it('Literals are combined', () => {
      const map1 = map.create({}, {
        item1: 'Value1',
      });
      const map2 = map.create({}, {
        item2: 'Value2',
      });
      const combined = map.combine(map1, map2);
      const result = map.run({}, combined);
      assert.property(
        result, 'item1'
      );
      assert.property(
        result, 'item2'
      );
      assert.equal(
        result.item1,
        'Value1'
      );
      assert.equal(
        result.item2,
        'Value2'
      );
    });
    it('Function Literals are combined', () => {
      const map1 = map.create({}, (value) => ({
        item1: value.value1,
      }));
      const map2 = map.create({}, (value) => ({
        item2: value.value2,
      }));
      const combined = map.combine(map1, map2);
      const result = map.run({
        value1: 'Value1',
        value2: 'Value2',
      }, combined);
      assert.property(
        result, 'item1'
      );
      assert.property(
        result, 'item2'
      );
      assert.equal(
        result.item1,
        'Value1'
      );
      assert.equal(
        result.item2,
        'Value2'
      );
    });
    it('Function Literals and Objects are combined', () => {
      const map1 = map.create({}, {
        item1: 'Value1',
      });
      const map2 = map.create({}, (value) => ({
        item2: value.value2,
      }));
      const combined = map.combine(map1, map2);
      const result = map.run({
        value1: 'Value1',
        value2: 'Value2',
      }, combined);
      assert.property(
        result, 'item1'
      );
      assert.property(
        result, 'item2'
      );
      assert.equal(
        result.item1,
        'Value1'
      );
      assert.equal(
        result.item2,
        'Value2'
      );
    });
    it('Objects and Function Literals are combined', () => {
      const map1 = map.create({}, {
        item1: 'Value1',
      });
      const map2 = map.create({}, (value) => ({
        item2: value.value2,
      }));
      const combined = map.combine(map1, map2);
      const result = map.run({
        value1: 'Value1',
        value2: 'Value2',
      }, combined);
      assert.property(
        result, 'item1'
      );
      assert.property(
        result, 'item2'
      );
      assert.equal(
        result.item1,
        'Value1'
      );
      assert.equal(
        result.item2,
        'Value2'
      );
    });
  });
});
