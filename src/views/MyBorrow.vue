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
        <b-button variant="primary" @click="approve(row)" :disabled=!row.item.showApprove>Approve</b-button>
        &nbsp;&nbsp;
        <b-button variant="warning" :disabled=!row.item.Approve @click="mint(row)">Mint</b-button>
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
import {tokenABI , testConfig} from "../../test/mock/config";
import { ethers } from "ethers";
// const tokenABI = [];
// const webTokens = []; 

  export default {
    data() {
      return {
        items: [
          // { isActive: true, Symbol: 40, Address: "addr", Balance: 30 , isEnabled: true},
        ],
        fields: [
          { key: 'Address', label: 'Address' },
          { key: 'Symbol', label: 'Symbol', sortable: true, class: 'text-center' },
           { key: 'Balance' }
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
      async getAgent(){
          const { ethereum } = window
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = await provider.getSigner()
          const contract = new ethers.Contract( testConfig.agentAddr,
              tokenABI,
              signer
          );
          if(window.agentAddr){
              return window.agentAddr;
          }
          window.agentAddr = await contract.getAgent();  
          return window.agentAddr ;
      },
      async mint(row){
        // alert(JSON.stringify(row.item.Balance));
        const { ethereum } = window
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner()
        const contract = new ethers.Contract( testConfig.contractAddr,
            tokenABI,
            signer
          );
        console.log(contract);
        const gasPrice = await  provider.getGasPrice();
        const options = { gasLimit: 2300000, gasPrice: gasPrice, value: 0 };  
        await contract.mint(row.item.Address, testConfig.borrowAddr, row.item.Balance, options);
      },
      async approve(row){
        // alert(JSON.stringify(row.item.Balance));
        const { ethereum } = window
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner()
        const contract = new ethers.Contract( row.item.Address,
            tokenABI,
            signer
          );
        await contract.approve(testConfig.contractAddr, row.item.Balance);
      },
      async loadData() {
        const { ethereum } = window
        const list = [];
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(testConfig.borrowAddr,
            tokenABI,
            signer
          );

        // console.log(contract);
        const agentAddr = await this.getAgent();
        const balance = await contract.borrowBalanceStored( agentAddr);
        const symbol = await contract.symbol();
        list.push({showApprove: false, Approve: false,Address: testConfig.borrowAddr,  Symbol: symbol, Balance: balance.toString(), isEnabled: false});

        return list;
      }
    }
  }
</script>