#!/usr/bin/env node

const commander = require('commander')
const pkg = require('./package.json')
const https = require('https')
const http = require('http')
const SocksAgent = require('socks-proxy-agent')
const fs = require('fs')
const os = require('os')
const path = require('path')
const translate = require('./translate')
const chalk = require('chalk')

const program = new commander.Command()

const happyRCPath = path.resolve(os.homedir(), '.happyrc')
const config = JSON.parse(fs.readFileSync(happyRCPath, 'utf8').toString())

program.version(pkg.version)

const runConfig = (action, cmdObj) => {
    if(action === 'set') {
        const newConfig = {...config, proxy: program.proxy}
        console.log(newConfig)
        fs.writeFile(happyRCPath, JSON.stringify(newConfig), 'utf8', (err) => {
            if(err) console.error(err)
            console.log(chalk.green('set config proxy success!'))
        })
    }else if(action === 'reset') {
        fs.writeFile(happyRCPath, JSON.stringify({}), 'utf8', err => {
            if(err) console.error(err)
            console.log(chalk.blue('reset config'))
        })
    }
}

program.command('config <action>')
    .option('-p, --proxy', 'specify a proxy')
    .action(runConfig)

const runTranslate = (dir, cmdObj) => {
    /**
     * 代理配置的优先级从高到低是 参数 -> 环境变量 -> 配置文件
     */
    const proxy = program.proxy || process.env.PROXY || config.proxy
    if (proxy) {
        https.globalAgent = new SocksAgent(proxy)
        http.globalAgent = new SocksAgent(proxy)
    }
    let from = program.from
    let to = program.to
    const text = program.args.join(' ')
    translate(text, to, from)
}

program
    .option('-f, --from [from]', 'specify input language')
    .option('-t, --to [to]', 'specify output language')
    .option('-p, --proxy [proxy]', 'specify a socks agent')
    .action(runTranslate)


program.parse(process.argv)
