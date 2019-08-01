import {prop, complement, equals, tryCatch, forEach, pipe, find, eqProps, unless, isNil, always} from 'ramda';
class DataSource {
  _listeners = [];
  _data;
  addChangeListener(listener) {
    console.log('addChangeListener', listener);
    this._listeners.push(listener);
  }

  removeChangeListener(listener) {
    const notEquals = complement(equals);
    this._listeners = this._listeners.filter(notEquals(listener));
  }

  setData(data) {
    const safeForEach = tryCatch(forEach, always({}));
    const notifyListeners = safeForEach((listener)=> listener(data));
    this._data = data;
    notifyListeners(this._listeners);
  }

  getData() {
    return this._data;
  }

  getItemById(id) {
    const findById = unless(isNil, find(eqProps({id})));
    const result = findById(this._data);
    console.log(result);
    return result;
  }
}

export const CommentsDataSource = new DataSource();
export const BlogPostDataSource = new DataSource();