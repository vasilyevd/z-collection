import {ICollection} from './interface';
import {$Util} from '../core/utils';

// @todo: Collection
export class Collection<T = any> implements ICollection {

  public items: T[] = [];

  public add(item: T) {
    this.items.push(item);
  }

  public remove(item){
    console.warn('Implement remove Item from collection!');
  }

  public clear() {
    this.items.length = 0;
  }

  public all() {
    return this.items;
  }

  public isEmpty(): boolean {
    return !(this.items?.length);
  }

  public hasItems(): boolean {
    return Boolean($Util.isArray(this.items) && this.items.length);
  }

  public size(): number {
    return this.items?.length ?? 0;
  }

  public forEach(iterateFn){
    console.warn('Implement iteration through Collection!');
  }

  public doFilter(filterFn) {
    console.warn('Implement filter through Collection!');
  }

  public findIndex(finder: () => number) {
    console.warn('Implement finde through Collection!');
  }

}


