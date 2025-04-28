import chalk from 'chalk'
import inquirer from 'inquirer'
import { spawn } from 'child_process'

const commandChoices = [
  {
    name: `🚀 Start con API Remote (${chalk.dim(
      'Default - Server Render.com'
    )})`,
    value: 'API_TYPE=remote bun expo start',
  },
  {
    name: `🏠 Start con API Local (${chalk.dim('Per device fisico su WiFi')})`,
    value: 'API_TYPE=local bun expo start',
  },
  {
    name: `📱 Start con API Emulator (${chalk.dim('Per emulatore Android')})`,
    value: 'API_TYPE=emulator bun expo start',
  },
  {
    name: `🔄 Start Remote + Clear Cache (${chalk.dim('Pulizia cache Metro')})`,
    value: 'API_TYPE=remote bun expo start --clear',
  },
  {
    name: `🧹 Clear Cache (${chalk.dim('Solo pulizia della cache')})`,
    value: 'bun expo start --clear',
  },
  {
    name: `🧹📱 Clear Cache Android (${chalk.dim(
      'Solo pulizia della cache specifica android simulator'
    )})`,
    value: 'bunx expo start --clear --android',
  },
  // Aggiunto comando con porta alternativa per risolvere problemi di conflitto
  {
    name: `🧹📱🔌 Clear Cache Android + Porta alternativa (${chalk.dim(
      'Risolve problemi di porta'
    )})`,
    value: 'bunx expo start --clear --android --port 19001',
  },
  {
    name: `🧹🔄 Pulizia processi emulatore e riavvio (${chalk.dim(
      'Risolve problemi di emulatore zombie'
    )})`,
    value:
      'pkill -9 qemu-system && adb kill-server && adb start-server && bunx expo start --android',
  },
  {
    name: `🔍 Verifica porte Metro in uso (${chalk.dim(
      'Controlla porta 8081'
    )})`,
    value: 'lsof -i :8081',
  },
  {
    name: `🗺️  Sitemap (${chalk.dim('Mostra mappa App')})`,
    value: 'bunx expo-router-sitemap',
  },
  { name: `🚪 Esci (${chalk.dim('Non fare nulla')})`, value: null },
]

async function run() {
  console.log(
    chalk.cyanBright.bold('🔧 Seleziona la configurazione per avviare Expo:')
  )

  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: 'Quale configurazione vuoi utilizzare?',
        choices: commandChoices,
      },
    ])

    const commandToExecute = answers.selectedCommand

    if (commandToExecute === null) {
      console.log(chalk.yellow('👋 Uscita dalla CLI.'))
      process.exit(0)
    }

    console.log(
      chalk.yellow(
        `\n✨ Avvio di Expo con configurazione: ${chalk.bold(
          commandToExecute
        )}\n`
      )
    )

    let command, args

    if (commandToExecute.startsWith('API_TYPE=')) {
      const parts = commandToExecute.split(' ')
      const envVar = parts[0]

      const env = { ...process.env }
      const [envName, envValue] = envVar.split('=')
      env[envName] = envValue

      command = parts[1]
      args = parts.slice(2)

      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: process.platform === 'win32',
        env: env,
      })

      handleChildProcess(child)
    } else {
      const parts = commandToExecute.split(' ')
      command = parts[0]
      args = parts.slice(1)

      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: process.platform === 'win32',
      })

      handleChildProcess(child)
    }
  } catch (error) {
    if (error.isTtyError) {
      console.error(
        chalk.red(
          '❌ Errore TTY: Impossibile renderizzare il prompt interattivo.'
        )
      )
      console.error(
        chalk.red(
          '   Esegui lo script in una sessione interattiva del terminale.'
        )
      )
    } else {
      console.error(
        chalk.red('❌ Si è verificato un errore imprevisto nella CLI:'),
        error
      )
    }
    process.exit(1)
  }
}

function handleChildProcess(child) {
  child.on('error', (error) => {
    console.error(
      chalk.red(
        `\n❌ Errore durante l'avvio del processo figlio: ${error.message}`
      )
    )
    process.exit(1)
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(
        chalk.yellow(`\nℹ️ Processo terminato dal segnale: ${signal}`)
      )
    } else if (code !== null && code !== 0) {
      console.error(
        chalk.red(`\n❌ Processo terminato con codice di errore: ${code}`)
      )
    } else {
      console.log(chalk.green('\n✅ Processo terminato correttamente.'))
    }
  })
}

run()
