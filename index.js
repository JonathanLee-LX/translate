#!/usr/bin/env node

const commander = require('commander')
const translate = require('@jonathanleelx/google-translate-api')
const pkg = require('./package.json')
const chalk = require('chalk')
const ora = require('ora')

const program = new commander.Command()

program.version(pkg.version)
.option('-f, --from [from]', 'specify input language')
.option('-t, --to [to]', 'specify output language')
.parse(process.argv)

let from = program.from
let to = program.to

const text = program.args.join(' ')
const enReg = /^[a-zA-Z]+$/
const zhReg = /^[\u4e00-\u9fa5]+$/
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

const spinner =  ora().start()

// console.log('🚀')
console.log(chalk.blueBright(`检测到:"${from}"`))
translate(text, {to, from }).then(res => {
    spinner.stop()
    spinner.clear()
    console.log(chalk.green(to) ,chalk.green('->'), chalk.greenBright(res.text))
}).catch(err => {
    spinner.stop()
    spinner.clear()
    console.error(chalk.redBright(err))
})
