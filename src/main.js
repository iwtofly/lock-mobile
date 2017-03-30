/**
 * @author: iwtofly
 * @file: 实现密码锁的主文件
 */
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import './style.scss';


class App extends PureComponent {
    constructor(props) {
        super(props);
        this.alert = {
            'short': '密码太短，至少需要5个点',
            'pleaseWrite': '请输入手势密码',
            'again': '请再次输入手势密码',
            'notMatch': '两次输入密码不一致,请重新设置',
            'success': '密码设置成功',
            'wrong': '输入的密码不正确',
            'correct': '密码正确',
            'toOpen': '请输入密码解锁'

        }
        this.state = {
            radioValue: 'set',
            current: undefined,
            firstTempKey: [],
            secondTempKey: [],
            alertColor: 'black',
            tempKey: [],
            times : 1,
            showMsg: '请输入手势密码'
        };
        
        this.handleChange = this.handleChange.bind(this);
    }
    // 在points上绑定了touchStart事件监听
    handleTouchStart(e) {
        const { times, firstTempKey, secondTempKey } = this.state;
        // console.log('touch start');
        // console.log('第' + times + '次设置');
        this.setState({
            current: e.target,
        });
        let points = document.querySelectorAll('.point');
        points = Array.prototype.slice.call(points);
        let temp = new Set();
        this.colorRecover();
        // 为每个子节点添加touch相关事件，利用ES set
        for (let key in points) {
            let point = points[key];
            Touch.over(point, () => {
                let num = point.className.split(' ')[1];
                point.className = point.className + (point.className.indexOf('chosen') != -1 ? '' : ' chosen');
                temp.add(num);
                this.setKey(times, temp);
            });
            Touch.out(point, () => {

                let num = point.className.split(' ')[1];
                point.className = point.className + (point.className.indexOf('chosen') != -1 ? '' : ' chosen');
                temp.add(num);
                this.setKey(times, temp);
            });
        }
        
    }
    setKey(times, temp) {
        switch (times) {
            case 1:
                this.setState({
                    firstTempKey: Array.from(temp)
                });
                break;
            case 2:
                this.setState({
                    secondTempKey: Array.from(temp)
                });
                break;
            case 0:
            default:
                this.setState({
                    tempKey: Array.from(temp)
                });
        }
    }

    /**
     * 重置颜色
     * @return void
     */
    colorRecover() {
        let points = document.querySelectorAll('.point');
        points = Array.prototype.slice.call(points);
        for (let key in points) {
            let point = points[key];
            point.className = 'point ' + key;
        }
    }

    /**
     * 监听touchEnd事件
     * @param  {[event]}
     */
    handleTouchEnd(e) {
        console.log('touch end');
        console.log(this.state.firstTempKey, this.state.secondTempKey);
        const {times, firstTempKey, secondTempKey, radioValue, tempKey} = this.state;
        this.colorRecover();
        // 字数是否够5
        let flag = true;
        if (times == 1) {
            if (this.state.firstTempKey.length < 5) {
                flag = false;
                this.setState({
                    alertColor: 'red'
                })
                this.showAlert('short');
                
            } else {
                this.showAlert('again');
                this.setState({
                    alertColor: 'black'
                })
            }
        }
        let secondMatch = false;
        if (times == 2) {
            this.checkMatch(firstTempKey, secondTempKey);
        }
        if (radioValue == 'confirm' || times == 0 ) {
            let localKey = localStorage.getItem('key').split(',');
            secondMatch = this.checkMatch(localKey, tempKey);
        }
        if (times == 1 && flag) {
            this.setState({
                times: 2
            });
        } else if(times == 2) {
            // console.log('第二次输错了啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊');
            this.setState({
                times: secondMatch ? 2 : 1
            });
        } else {
            this.setState({
                times: times
            });
        }
    }
    /**
     * 检查是否匹配：会根据结果做一些颜色相关、显示提示相关的设置
     * @param  {array} arr1 对比密码1，有可能是 localstorage获取，或用户第一次设置的密码
     * @param  {array} arr2 对比密码2，有可能是 用户二次输入的设置密码，或验证密码
     * @return {boolean} 用于返回是否匹配
     */
    checkMatch(arr1, arr2) {
        const { times } = this.state;
        let flag = true;
        if (arr1.length == arr2.length) {
            for(var i = 0; i < arr1.length; i++) {
                if(arr1[i] == arr2[i]) {
                } else {
                    flag = false;
                    break;
                }
            }
        } else {
            flag = false;
        }
        if (flag) {
            this.setState({
                alertColor: '#449d44'
            });
            if (this.state.times == 0) {
                this.showAlert('correct');
            } else {
                this.showAlert('success');
            }
            // 均匹配，设置Localstorage，存入key中
            localStorage.removeItem('key');
            localStorage.setItem('key', this.state.firstTempKey);
        } else {
            this.showAlert(times == 0 ? 'wrong' : 'notMatch');
            this.setState({
                alertColor: 'red'
            });
            return false;
        } 
        return flag;
    }

    /**
     * 显示提示信息函数
     * @param  {[string]} msg 为this.alert设置的各种key值
     */
    showAlert(msg) {
        console.log(msg);
        this.setState({
            showMsg: this.alert[msg]
        })
    }

    /**
     * 处理radio变化，会做颜色恢复，等设置
     * @param  {event} e 触发事件
     */
    handleChange(e) {
        this.setState({
            radioValue: e.target.value,
            alertColor: 'black'
        });
        // console.log(e.target.value);
        if (e.target.value == 'set') {
            this.setState({
                radioValue: 'set',
                times: 1,
                showMsg: this.alert['pleaseWrite']
            });
        } else if(e.target.value == 'confirm') {
            this.setState({
                radioValue: 'confirm',
                times: 0,
                showMsg: this.alert['toOpen']
            });
        }
        this.colorRecover();
    }
    /**
     * render部分
     * @return {[type]} [description]
     */
    render () {
        const { radioValue, showMsg, alertColor} = this.state;
        let showMsgStyle;
        return (
            <div>
                <div className='points'
                    id='points'
                    ref='points'
                    onTouchStart={this.handleTouchStart.bind(this)}
                    onTouchEnd={this.handleTouchEnd.bind(this)}>
                    <span ref='1' className='point 0'></span>
                    <span ref='2' className='point 1'></span>
                    <span ref='3' className='point 2'></span>

                    <span ref='4' className='point 3'></span>
                    <span ref='5' className='point 4'></span>
                    <span ref='6' className='point 5'></span>

                    <span ref='7' className='point 6'></span>
                    <span ref='8' className='point 7'></span>
                    <span ref='9' className='point 8'></span>
                </div>
                <div className='alert' style={{color: alertColor}}>{showMsg}</div>
                <div className='choice'>
                <form>
                    <label>
                        <input type="radio"
                                name="set"
                                value='set'
                                checked={radioValue == 'set' ? true : false}
                                onChange={this.handleChange}/>
                        设置密码
                    </label><br/>
                    <label>
                        <input type="radio"
                                name="confirm"
                                value='confirm'
                                checked={radioValue == 'confirm' ? true : false}
                                onChange={this.handleChange}/>
                        验证密码
                    </label>
                    </form>
                </div>
            </div>
        );
    }
}


ReactDOM.render(
    <App/>
    , document.getElementById('content')
);
