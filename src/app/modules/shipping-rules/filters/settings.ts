import {Injectable} from '@angular/core';
import {$Util} from '../../../core/utils/common';
import {isObservable, Observable, of} from 'rxjs';

class AttributeFilter {
  private _type;
  private _value;
  private _label;
  private _hint;
  private _enum_list: any[];

  constructor(name, config) {
    console.log('CREATED-ATTRIBUTE-FILTER-WITH-CONFIG', config);

    this._label = config.label || null;
    this._hint = config.hint || null;
    this._type = config.type || 'ILIKE_STRING';

    let configEnum = config.enum;

    console.log('ENUM-TYPES-DETECTION:');
    console.log('isObservable', isObservable(configEnum));
    console.log('isFunction', $Util.isFunction(configEnum));
    console.log('isArray', $Util.isArray(configEnum));

    if($Util.isFunction(configEnum)) {
      console.log('  ENUM-IS-FUNCTION');
      const builderFn: (filter) => any[] = configEnum;
      configEnum = builderFn(this);
    }

    // got observable
    if(isObservable(configEnum)) {
      const observableEnum: Observable<any[]> = configEnum as Observable<any[]>;
      console.log('  USE-UNUM-FROM-OBSERVABLE-OBJECT');
      observableEnum.subscribe(newEnumList => {
        console.log('   GOT ENUM from observer', newEnumList);
        this._enum_list = newEnumList;
      });
    }
    // got static enum list
    else if (configEnum) {
      console.log('  USE STATIC ENUM');
      this._enum_list = configEnum;
    }
  }

  getValue() {
    return this._value;
  }

  setValue(value) {
    this._value = value;
  }

  setEnum(list) {
    this._enum_list = list;
  }

  getEnum() {
    return this._enum_list;
  }

  /**
   * Provide type
   */
  getType() {
    return this._type;
  }

  public onChange: () => void
}

abstract class FilterService {

  protected abstract $config();

  private _filters = {};

  private config;

  private _attributes;

  private _eventCallbacks = [];

  constructor(config?) {
    console.log('FILTER-SERVICE', 'CONSTRUCTOR');
    config = config ?? this.$config();

    Object.keys(config).forEach((attribute) => {
      this.addFilter(attribute, config[attribute]);
    });
  }

  getConfig() {
    return this.config;
  };

  addFilter(attribute, config) {
    this._filters[attribute] = new AttributeFilter(attribute, config);
  }

  getFilter(attribute) {
    return this._filters[attribute];
  };

  hasFilter(attribute) {
    return Boolean(this._filters[attribute]);
  };

  getFilters() {
    return this._filters;
  };

  toRequest() {
    return {};
  };

  addOnChangeEventListener(fn) {
    if ($Util.isFunction(fn)) {
      this._eventCallbacks.push(fn);
    }
  }

}

@Injectable()
export class ShippingRulesFilter extends FilterService {

  /**
   * Итак енум для фильтра может быть статичен - его можно передать внутри конфига.
   * Может быть загружаемым из внешнего источника.
   * а) загружаем его при создании фильтра и передаем в качестве конфига.
   * б) передаем в конфиг источник, а тот кому потребуется будет его использовать.
   *
   * По мере использования фильтра - может понадобиться логика взаимодействия между атрибутами.
   * Например при выборе одно из атрибутов - включается другой атрибут и его значения подгружаются или отфильтровываются из исходного массива.
   *
   * В случае с подписчиком - это имеет смысл так как мы можем предоставлять данные из одного места для всего приложения.
   * Так например список доступных пользователю хабов - может использоваться в фильтре, при создании правила и т.п.
   * Становится вопрос актуальности данных и возможности запросить эти данные.
   * Получение данных - они начинают появляться как только кто-то подписывается?
   * Просто если это подписчик, то данные уже должны быть в например в енаме. Это может создать проблемы если уже все загружено а потом произошла ошибка.
   * В этом случае нам требуется произвести загрузку (инициализацию сервиса до загрузки страницы, но после гварда).
   * Т.е. в резолве мы создаем источник и запускаем его наполнение - по итогу возвращаем ок или нет.
   * Если ок  - то юзаем его как источник данных. Но он подходит только для получения статических данных (подписка только обеспечивает возможность обновить спустя время и отправить новые)
   *
   * Напрашивается некий сервис ИсточникДанных - который может дать ресурс для подписки а так же предоставить возможность сообщать ему о факте необходимости данных (например по этому факту он может проверить время кеша и запросить где-то еще обновленные данные).
   * Как в таком случае строится взаимодействие с Источником.
   *
   * Фильтр единожды подписывается на Источник и ждет от него данных. Каждый раз когда они меняются он использует новую версию списка.
   *
   * Таким же образом мы можем из статических данных создавать источники и использовать их в компонентах. Например если мы передали какой-то статический енум, то:
   * создаем Источник и посылаем сообщение с этим значением. При использовании метода SetEnum - мы сохраняем новое значение и сообщаем через next() новое значение.
   *
   * Хм. Кому сообщаем? Для компонентов єто значение должно быть статическим. Все подписки и обновления происходят внутри объекта фильтра....
   *
   *
   * enum: EnumList | Observable<EnumList> | (filter) => EnumList
   *
   *
   *
   *
   * !!! Может быть стоит различать источник енумов в фильтре и само значение фильтра.
   * Так например мы можем получить подписку в которой прилетит 100500 значений. И как быть если нам надо отфильтровать?
   * !!)) Так ведь то что прилетело мы сохраняем как статику и потом фильтруем ее.
   *
   * Но если мы например отфильтровали, а пом надо сбросить фильтр? Где брать данные)))
   * А не должен ли этим заниматься сервис фильтров - зная при этом где брать данные и как фильтровать между собой)
   *
   */
  $config() {
    return {
      id: {
        type: 'LIKE_INT',
        ui: 'input:text',
        label: 'Rule ID',
        hint: false
      },

      /** Just show select with values */
      action: {
        type: 'EQUAL_ENUM',
        ui: 'select',
        label: 'Action',
        enum: [
          {
            key: 'Allow',
            value: 'ALLOW'
          },
          {
            key: 'Deny',
            value: 'DENNY'
          }
        ],
      },

      /** Show select based on data from... BackEnd... Some service with data. */
      hub: {
        type: 'EQUAL_ENUM',
        ui: 'select',
        label: 'Hub',
        enum: this.gotObservable
      },

      testFn: {
        type: 'TEST',
        label: 'test',
        enum: this.someEnumListFunction
      },

      testFn2: {
        type: 'TEST',
        label: 'test2',
        enum: of<{k:string, v: number}[]>([{k:'off1',v: 1}, {k:'off2', v:3}] )
      }
    }
  }

  constructor() {
    super();
  }

  someEnumListFunction(filter) {
    console.log('someEnumListFunction RUNNED');
    return [
      { key: 'some1', value: 55 },
      { key: 'some2', value: 56 },
    ];
  }

  gotObservable() {
    return of<{k:string, v: number}[]>([{k:'fob',v: 10}, {k:'fob2', v:30}] )
  }


}
