#!/usr/bin/env node

const commander = require('commander')
const translate = require('@jonathanleelx/google-translate-api')
const pkg = require('./package.json')
const chalk = require('chalk')

const program = new commander.Command()

program.version(pkg.version)
.option('-f, --from [from]', 'specify input language')
.option('-t, --to [to]', 'specify output language')
.parse(process.argv)

const from = program.from
const to = program.to

translate(program.args.join(' '), {to, from }).then(res => {
    console.log(chalk.greenBright(res.text))
}).catch(err => {
    console.error(err)
})
