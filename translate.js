const translate = require('google-translate-api')
const chalk = require('chalk')
const ora = require('ora')

module.exports = (text, to, from) => {
    const enReg = /^[a-zA-Z]+/
    const zhReg = /^[\u4e00-\u9fa5]+/
    const isEn = enReg.test(text)
    const isZH = zhReg.test(text)

    if(!to) {
        if(isEn) {
            to='zh-cn'
        }else if(isZH) {
            to='en'
        }
    }

    if(!from) {
        // 翻译的文本不为中文时，默认翻译为简体中文
        if(isEn) from='en'
        if(isZH) from='zh-cn'
    }


    console.log(chalk.blueBright(`检测到:"${from}"`))
    const spinner = ora().start()
    translate(text, {to, from }).then(res => {
        spinner.stop()
        spinner.clear()
        console.log(chalk.green(to) ,chalk.green('->'), chalk.greenBright(res.text))
    }).catch(err => {
        spinner.stop()
        spinner.clear()
        console.error(chalk.redBright(err))
    })

}