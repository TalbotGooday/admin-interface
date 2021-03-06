// @flow
import {
    EventEmitter,
    Registry,
    yamlConfigParse,
    setConfigFileFromRc
} from '@admin-interface/core';
import '../Event/Installation';

/**
 * Admin Interface class
 */
class AdminInterface {
    _useRC: boolean = true;

    setConfigFile(dirname: string, configFile: string): AdminInterface { // aeslint-disable-line class-methods-use-this
        Registry.getRepository('App').set('cwd', dirname);

        const config = yamlConfigParse(dirname, configFile);
        EventEmitter.emit('set-config', config);

        // Do not use the .admininterfacerc file
        this.setUseRC(false);

        return this;
    }

    start(): void {
        if (this.getUseRC()) {
            // Set config file from the .admininterfacerc file
            setConfigFileFromRc();
        }

        EventEmitter.emit('start:after');

        EventEmitter.emit('start:init-plugin', this);

        EventEmitter.emit('start');

        EventEmitter.emit('start:before');
    }

    middleware(): express$Application {
        // run project
        this.start();

        // get local express app
        return Registry.getRepository('App').get('instance');
    }

    setUseRC(useRC: boolean = true): AdminInterface {
        if (typeof useRC === 'boolean') {
            this._useRC = useRC;
        }
        return this;
    }

    getUseRC(): boolean {
        return this._useRC;
    }
}

export default AdminInterface;
