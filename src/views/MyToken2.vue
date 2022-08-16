<template>
  <b-container fluid>
    

    <!-- Main table element -->
    <b-table
      show-empty
      small
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
    >
      <template v-slot:cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <template v-slot:cell(actions)="row">
        <!-- <b-button size="sm"  class="mr-1" >
          Approve
        </b-button> -->
        <b-button variant="primary" @click="enterMarket(row)"  :disabled=row.item.EnterMarket>EnterMarket</b-button>
        &nbsp;&nbsp;
        <b-button variant="primary" @click="approve(row)" :disabled=!row.item.showApprove>Approve</b-button>
        &nbsp;&nbsp;
        <b-button variant="warning" :disabled=!row.item.Approve @click="mint(row)">Mint</b-button>
         &nbsp;&nbsp;
        <b-button variant="success"  @click="redeem(row)">Redeem</b-button>
        &nbsp;&nbsp;
        <!-- <b-button variant="success"  @click="recharge(row)">Recharge</b-button> -->
        <!-- <b-button size="sm" @click="row.toggleDetails">
          Mint
        </b-button> -->
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

  </b-container>
</template>

<script>

// import config from '../config/config.json'
import {tokenABI , webTokens, testConfig} from "../../test/mock/config";
import { ethers } from "ethers";
// const tokenABI = [];
// const webTokens = []; 

  export default {
    data() {
      return {
        agentAddr: '',
        items: [
          // { isActive: true, Symbol: 40, Address: "addr", Balance: 30 , isEnabled: true},
        ],
        fields: [
          { key: 'Address', label: 'Address' },
          { key: 'Symbol', label: 'Symbol', sortable: true, class: 'text-center' },
           { key: 'Balance' },
          {
            key: 'Approve'},
          { key: 'actions', label: 'Actions' }
        ],
        items2: [],
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
      }
    },
    async created (){
        console.log("created-------");
        this.items = await this.loadData()
    },
    computed: {
      sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      }
    },
    // mounted() {
    //   // Set the initial number of items
    //   this.totalRows = this.items.length
    // },
    methods: {
      async redeem(row){
          console.log(row);

          const agentAddr = await this.getAgent();

          const { ethereum } = window
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = await provider.getSigner()
          const contract = new ethers.Contract( testConfig.borrowAddr,
              tokenABI,
              signer
            );  
          var bowrrowAmount =  await contract.borrowBalanceStored(agentAddr);  
          console.log("bowrrowAmount: ", bowrrowAmount.toString());
          const amount = ethers.utils.parseUnits("5", 16);
          bowrrowAmount = bowrrowAmount.add(amount);
          console.log("bowrrowAmount: ", bowrrowAmount.toString());

          const repayContract = new ethers.Contract( agentAddr,
              tokenABI,
              signer
            );
          const gasPrice = await  provider.getGasPrice();
          const options = { gasLimit: 1200000, gasPrice: gasPrice, value: bowrrowAmount };    
          // const options = {  value: bowrrowAmount};    
          await repayContract.repayAndredeem(testConfig.repayAddr, testConfig.tToken(), options);  
      },  
      async mint(row){
        // alert(JSON.stringify(row.item.Balance));
        const agentAddr = await this.getAgent();

        console.log(agentAddr);

        const { ethereum } = window
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner()
        const contract = new ethers.Contract( agentAddr,
            tokenABI,
            signer
          );
        console.log(contract);
        const gasPrice = await  provider.getGasPrice();
        const options = { gasLimit: 1200000, gasPrice: gasPrice, value: 0 };  
        await contract.mint(row.item.Address, testConfig.borrowAddr, row.item.Balance, options);
      },
      async recharge(){
        // alert(JSON.stringify(row.item.Balance));
        // const { ethereum } = window
        // const provider = new ethers.providers.Web3Provider(ethereum);
        // const signer = await provider.getSigner()
        // const contract = new ethers.Contract( row.item.Address,
        //     tokenABI,
        //     signer
        //   );
        // await contract.approve(testConfig.contractAddr, row.item.Balance);
        // const { ethereum } = window
        // const provider = new ethers.providers.Web3Provider(ethereum);
        // await provider.request({
        //     method: "hardhat_impersonateAccount",
        //     params: [testConfig.holder],
        // });
        // await hre.network.provider.request({
        //   method: "hardhat_impersonateAccount",
        //   params: [testConfig.holder()],
        // });

        // const holderSigner = await ethers.getSigner(testConfig.holder())
        // const tokenContract = new ethers.Contract(row.item.Address, tokenABI, holderSigner);

        // const amount = ethers.utils.parseUnits(testConfig.amount, 18);
        // await tokenContract.approve(testConfig.addr, amount);
        // await tokenContract.transfer(testConfig.addr, amount);
      },
      async enterMarket(){
          // console.log(row);
          const { ethereum } = window
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = await provider.getSigner()
          const contract = new ethers.Contract( testConfig.agentAddr,
              tokenABI,
              signer
          );  
          await contract.createAgent();
          // window.agentAddr = await contract.getAgent();
      },
      async approve(row){
        // console.log(row.item.Balance);
        // console.log(await this.getAgent());
        const agentAddr = await this.getAgent();
        console.log(agentAddr);
        const { ethereum } = window
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner()
        const contract = new ethers.Contract( row.item.Address,
            tokenABI,
            signer
          );
        await contract.approve(agentAddr, row.item.Balance);
      },
      async getAgent(){
          const { ethereum } = window
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = await provider.getSigner()
          const contract = new ethers.Contract( testConfig.agentAddr,
              tokenABI,
              signer
          );
          // if(window.agentAddr){
          //     return window.agentAddr;
          // }
          window.agentAddr = await contract.getAgent();  
          return window.agentAddr ;
      },
      async loadData() {
        const { ethereum } = window
        const tokens = webTokens;
        const list = [];


        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner()

        const agentContract = new ethers.Contract(testConfig.agentAddr,
            tokenABI,
            signer
          );
        const agentAddr = await agentContract.getAgent();
        console.log("agentAddr: ", agentAddr);
        const enterMarket = agentAddr != "0x0000000000000000000000000000000000000000";
        console.log("enterMarket: ", enterMarket);

        for (var i = 0; i < tokens.length; i++) {
          const obj = { Address: tokens[i] };
          // console.log(signer);
          const contract = new ethers.Contract(tokens[i],
            tokenABI,
            signer
          );
          // console.log(contract);
          const balance = await contract.balanceOf( testConfig.addr);
          const symbol = await contract.symbol();

          const agentAddr = await this.getAgent();

          const allowance = await contract.allowance(testConfig.addr, agentAddr);
          if(balance > 1 && allowance > 0 ){
              obj.Approve = true;
          }else{
            obj.Approve = false;
          }
          if(balance > 0 && allowance <= 0 && enterMarket){
            obj.showApprove = true;
          }else{
            obj.showApprove = false;
          }
          obj.Balance = balance;
          obj.Symbol = symbol;
          obj.EnterMarket = enterMarket;
          // obj.Approve = false;
          console.log(balance.toString());
          list.push(obj);
        }

        // const contractSigner = await provider.getSigner(testConfig.contractAddr)
        // const b1 = await provider.getBalance(testConfig.contractAddr);
        // list.push({showApprove: false, Approve: false,Address: testConfig.contractAddr,  Symbol: "CRO", Balance: b1.toString(), isEnabled: false});


        return list;
      }
    }
  }
</script>