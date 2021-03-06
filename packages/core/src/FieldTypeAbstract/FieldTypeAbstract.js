// @flow
import fs from 'fs';
import path from 'path';
import lodash from 'lodash';

import Registry from '../Registry/Registry';
import { yamlConfigRoutingParser } from '../Utils/Yaml/Parser';

import type { IFieldType } from './IFieldType';
import type { RoutingType } from '../Utils/types';

/**
 * Field Type Abstract class
 */
class FieldTypeAbstract implements IFieldType {
    /**
     * Key FieldType
     * @type {string}
     * @private
     */
    _key: string;
    /**
     * Model key
     * @type {string}
     * @private
     */
    _modelKey: string;
    /**
     * Field key
     * @type {string}
     * @private
     */
    _field: string;
    /**
     * Default value
     * @type {*}
     * @private
     */
    _defaultValue: any;
    /**
     * Title
     * @type {string}
     * @private
     */
    _title: string;
    /**
     * Is disable field type
     * @type {boolean}
     * @private
     */
    _disabled: boolean          = false;
    /**
     * Sequelize field
     * @type {*}
     * @private
     */
    _sequelizeField: any;
    /**
     * Extra options
     * @type {{}}
     * @private
     */
    _options: { [string]: any } = {};

    /**
     * Routing cache
     * @type {RoutingType}
     */
    static _routingCache: RoutingType;

    /**
     * Get path
     * @abstract
     */
    static getThisPath(): string {
        throw new Error('Method the getThisPath is abstract');
    }

    /**
     * Get path to view
     * @type {string}
     */
    static getThisPathView(): string {
        return path.join(this.getThisPath(), 'view.jade');
    }

    /**
     * Get routing
     * @returns {RoutingType|null}
     */
    static getRouting(): RoutingType | null {
        const routingPath = `${ this.getThisPath() }/routing.yaml`;
        if (this._routingCache) {
            return this._routingCache;
        }

        if (fs.existsSync(routingPath)) {
            const routing      = yamlConfigRoutingParser(this.getThisPath(), 'routing.yaml');
            // save routing
            this._routingCache = routing;
            return routing;
        }
        return null;
    }

    /**
     * Set key
     * @param {string} key
     * @returns {FieldTypeAbstract}
     */
    setKey(key: string): FieldTypeAbstract {
        if (typeof key === 'string') {
            this._key = key;
        }
        return this;
    }

    /**
     * Get key
     * @returns {string}
     */
    getKey(): string {
        return this._key;
    }

    /**
     * Set model key
     * @param {string} modelKey
     * @returns {FieldTypeAbstract}
     */
    setModelKey(modelKey: string): FieldTypeAbstract {
        if (typeof modelKey === 'string') {
            this._modelKey = modelKey;
        }
        return this;
    }

    /**
     * Get model key
     * @returns {string}
     */
    getModelKey(): string {
        return this._modelKey;
    }

    /**
     * Set default value
     * @param {*} defaultValue
     * @returns {FieldTypeAbstract}
     */
    setDefaultValue(defaultValue: any): FieldTypeAbstract {
        this._defaultValue = defaultValue;
        return this;
    }

    /**
     * Get default value
     * @returns {any}
     */
    getDefaultValue(): any {
        return this._defaultValue;
    }

    /**
     * Set title
     * @param {string} title
     * @returns {FieldTypeAbstract}
     */
    setTitle(title: string = ''): FieldTypeAbstract {
        if (typeof title === 'string') {
            this._title = title;
        } else {
            throw new TypeError('Expected string value');
        }
        return this;
    }

    /**
     * Get title
     * @returns {string}
     */
    getTitle(): string {
        return this._title;
    }

    /**
     * Set field
     * @param {string} field
     * @returns {FieldTypeAbstract}
     */
    setField(field: string): FieldTypeAbstract {
        if (typeof field === 'string') {
            this._field = field;
        }
        return this;
    }

    /**
     * get filed
     * @returns {string}
     */
    getField(): string {
        return this._field;
    }

    /**
     * Set disable
     * @param {boolean} disable
     * @returns {FieldTypeAbstract}
     */
    setDisable(disable: boolean = false): FieldTypeAbstract {
        if (typeof disable === 'boolean') {
            this._disabled = disable;
        }
        return this;
    }

    /**
     * Get disable
     * @returns {boolean}
     */
    getDisable(): boolean {
        return this._disabled;
    }

    /**
     * Is disable
     * @returns {boolean}
     */
    isDisabled(): boolean {
        return this.getDisable();
    }

    /**
     * Set options
     * @param {{}} options - Object of options
     * @returns {FieldTypeAbstract}
     */
    setOptions(options: {}): FieldTypeAbstract {
        if (typeof options === 'object') {
            this._options = lodash.merge(this.getOptions(), options);
        }
        return this;
    }

    /**
     * Get options
     * @returns {{}}
     */
    getOptions(): { [string]: any } {
        return this._options;
    }

    /**
     * Set Sequelize field
     * @param {*} sequelizeField
     * @returns {FieldTypeAbstract}
     */
    setSequelizeField(sequelizeField: any): FieldTypeAbstract {
        this._sequelizeField = sequelizeField;
        return this;
    }

    /**
     * Get Sequelize field
     * @returns {*}
     */
    getSequelizeField(): any {
        return this._sequelizeField;
    }

    /**
     * Get context
     * @returns {{}}
     */
    context(): { [string]: any } {
        return {
            $field: this,
            ...Registry.getRepository('Config').get('locals')
        };
    }

    getValueFromObject(itemObject: { [string]: any }): any {
        return itemObject ? itemObject[ this.getField() ] : null;
    }

    /**
     * Render FieldType
     * @param {{}} itemObject
     * @returns {string}
     */
    render(itemObject?: { [string]: any }): string { // eslint-disable-line class-methods-use-this, no-unused-vars
        throw new Error('Method the render is abstract');
    }
}

export default FieldTypeAbstract;
