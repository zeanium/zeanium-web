/**
 * Created by yangyxu on 5/20/17.
 */
(function (zn, console){

    "use strict";

    /**
     * @description 获取样式的颜色值
     * @param {String} type - 样式名称 [ primary | success | warning | error | text ]
     * @return {String} String - 返回颜色值
     */
    function typeColor(type) {
        type = type || '';
        let color = '';       
        switch (type) {
            case 'primary': color = '#2d8cf0'; break; //蓝
            case 'success': color = '#19be6b'; break; //绿
            case 'warning': color = '#ff9900'; break; //黄
            case 'error': color = '#ed4014'; break; //红
            case 'text': color = '#000000'; break; //黑
            default: color = '#515a6e'; break; //灰
        }
        return color;
    }

    /**
    * @description 打印一个 [ title | text ] 胶囊型样式的信息
    * @param {String} title - title text
    * @param {String} info - info text
    * @param {String} type - style
    */
    console.capsule = function (title, info, type = 'primary', ...args) {
        //Js字符串拼接 ${ }
        console.log(
            `%c ${title} %c ${info} %c`,
            'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
            `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
            'background:transparent', ...args
        );
    };

    /**
    * @description 打印丰富多彩的文字
    * @param {String} value - 打印值
    * @param {String} style - style样式
    */
    console.colorful = function (value, style,...args) {
        console.log(
            `%c ${value || ""}`, `${style || ""}`, ...args
        );
    };

    /**
    * @description 打印 default 样式的文字
    * @param {String} value - 打印值
    */
    console.default = function (value, ...args) {
        console.colorful(value, `color: ${typeColor("default")};`,...args);
    };

    /**
    * @description 打印 primary 样式的文字
    * @param {String} value - 打印值
    */
    console.primary = function (value, ...args) {
        console.colorful(value, `color: ${typeColor("primary")};`, ...args);
    };

    /**
    * @description 打印 success 样式的文字
    * @param {String} value - 打印值
    */
    console.success = function (value, ...args) {
        console.colorful(value, `color: ${typeColor("success")};`, ...args);
    };

    /**
    * @description 打印 warning 样式的文字
    * @param {String} value - 打印值
    */
    console.warning = function (value, ...args) {
        console.colorful(value, `color: ${typeColor("warning")};`, ...args);
    };

    /**
    * @description 打印 error 样式的文字
    * @param {String} value - 打印值
    */
    console.error = function (value, ...args) {
        console.colorful(value, `color: ${typeColor("error")};`, ...args);
    };

    /**
    * @description 打印 3D 样式的文字
    * @param {String} value - 打印值
    */
    console.text3D = function (value, ...args) {
        //let style = "font-size:5em;color:red;font-weight:bolder;text-shadow:5px 5px 2px #fff, 5px 5px 2px #373E40, 5px 5px 5px #A2B4BA, 5px 5px 10px #82ABBA;"
        let style = "color: #393D49;font-size:2.5em;font-weight:bolder;text-shadow: 0 1px 0 #fff,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.1),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);";
        console.colorful(value, style, ...args);
    };

    /**
    * @description 打印 彩色 样式的文字
    * @param {String} value - 打印值
    */
    console.rainbow = function (value, ...args) {
        let style = 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;';
        console.colorful(value, style, ...args);
    };

    /**
    * @description 打印 图片
    * @param {String} imgUrl - 图片路径
    * @param {String} padding - padding值
    */
    console.picture = function (imgUrl, padding, ...args) {
        let style = `padding:${padding || "0px"};background:url('${imgUrl || ""}') no-repeat center;`;
        console.log(
            `%c `, `${style || ""}`, ...args
        );
    };

    /**
    * @description 打印 分组 console.group
    * @param {String} groupName - 组名
    * @param {Array} obj - 对象
    */
    console.groupBy = function (groupName, obj, ...args) {
        obj = obj || {};
        //#9E9E9E #03A9F4  #4CAF50 #6a6b6d
        let style = `color: #9E9E9E; font-weight: bold`;

        console.group(`${groupName}`);
        for (let key in obj) {
            console.log(`%c ${key} :`, `${style || ""}`, obj[key], ...args);
        }
        console.groupEnd();
    };

    /**
    * @description 打印 Object和Array等引用类型，打印的是该类型的值，而不是打印引用地址的值（[object Object] 、[object Array]）
    */
    console.print = function (...args) {
        try {
            let arr = [];
            arr.push(...args);
            arr.forEach((item, index) => {
                if (Object.prototype.toString.call(item) === '[object Object]' || Object.prototype.toString.call(item) === '[object Array]') {
                    arr[index] = JSON.parse(JSON.stringify(item));
                }
            });
            console.log(...arr);
        } catch (e) {
            console.error(`logger error: ${e}`);
        }
    };

    if (zn.DEBUG) {
        for (let key in console) {
            console[key] = function () { };
        }
        return;
    }
    
})(zn, window.console);
