<template>
  

  <div>
  <b-button id="connectButton" 
                            v-on:click="connectWallet"
                            :disabled="connecting"
                            class="btn btn-success">{{ (!connecting) ? 'Connect Metamask' : 'Connecting ... '}}</b-button>
</div>
  

</template>



<script>
import {ethers} from "ethers";
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      contract: null,
      loading: false,
      connecting: false,
      contractInitialised: false,
      currentAccount: null,
      currentBalance: 0,
      form: {
        depositAmount: 0,
        withdrawalAmount: 0
      }
    }
  },
  mounted () {
    // metamask
    const { ethereum } = window

    // initialise contract
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        '0x5FbDB2315678afecb367f032d93F642f64180aa3', // change this when deploy new contract
        [],
        signer
      )
      this.contract = Object.freeze(contract)
      console.log('Contract initialised')
    } else {
      this.contractInitialised = false
    }
  },
  methods: {
    // connect metamask wallet
    async connectWallet () {
      try {
        const { ethereum } = window

        // check if metamask is found
        if (!ethereum) {
          console.log('Metamask not detected')
          return
        }

        // get accounts
        this.connecting = true
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})

        this.connecting = false
        console.log('Found account', accounts[0])
        this.currentAccount = accounts[0] // set first account to currentAccount

        // check balance of account
        // this.checkBalance()

      } catch (error) {
        this.connecting = false
        console.log('Error connecting to metamask', error)
      }
    },

    // deposit ether to bank
    async deposit () {
      try {
        this.loading = true
        const options = {
          from: this.currentAccount,
          value: ethers.utils.parseEther(parseFloat(this.form.depositAmount).toString())
        }

        // call contract deposit method
        let txn = await this.contract.deposit(options)
        let txnResults = await txn.wait() // await for transaction to be mined
        console.log(txnResults)

        alert(`Successfully deposited ${this.form.depositAmount} ETH to bank`)
        this.checkBalance() // initiate check balance

        this.loading = false
        this.form.depositAmount = 0

      } catch (e) {
        console.log(e)
        this.loading = false
        alert('Failed to deposit')
      }
    },

    // withdraw ether from bank
    async withdraw () {
      try {
        const options = {
          from: this.currentAccount
        }
        this.loading = true

        // call contract withdraw method
        let txn = await this.contract.withdraw(
           ethers.utils.parseEther(parseFloat(this.form.withdrawalAmount).toString()),
          {...options}
        )
        let txnResults = await txn.wait() // await for transaction to be mined
        console.log(txnResults)

        alert(`Successfully withdrew ${this.form.withdrawalAmount} ETH from bank`)
        this.checkBalance() // initiate check balance

        this.loading = false
        this.form.withdrawalAmount = 0
      } catch (e) {
        console.log(e)
        this.loading = false
        alert('Failed to withdraw')
      }
    },

    // get current balance of account
    async checkBalance () {
        this.loading = true

        // call contract balance method
        let balance = await this.contract.balance({
            from: this.currentAccount
        })

        // convert wei to ether
        this.currentBalance = ethers.utils.formatEther(balance) // 1000000000000 = 1 ETH
        this.loading = false
    },
  }
}
</script>
