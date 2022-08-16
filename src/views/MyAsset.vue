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

      <!-- <template v-slot:cell(actions)="row">
        <b-button variant="primary" size="sm"  class="mr-1" @click="redeem(row)">
          Redeem
        </b-button>
      </template> -->

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
           { key: 'Balance' },
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
          console.log(row.item.Address);

          const { ethereum } = window
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = await provider.getSigner()
          const contract = new ethers.Contract( row.item.Address,
              tokenABI,
              signer
            );  
          var assetAmount =  await contract.balanceOf(testConfig.contractAddr);  
          console.log("assetAmount: ", assetAmount.toString());
          // const amount = ethers.utils.parseUnits("5", 16);
          // bowrrowAmount = bowrrowAmount.add(amount);
          // console.log("bowrrowAmount: ", bowrrowAmount.toString());

          // const repayContract = new ethers.Contract( "0xeb1e3d204b10e937d71e709673e65af2bb0af6f9",
          //     tokenABI,
          //     signer
          //   );  
          // const options = {  value: bowrrowAmount};    
          // await repayContract.repayBehalf(testConfig.contractAddr, options);  
          await contract.redeem(assetAmount);
      }, 
      async loadData() {
        const { ethereum } = window

        const list = [];

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner();

        const tonicContract = new ethers.Contract(testConfig.tonicSocketAddr,tokenABI,signer);
        const assetIn =await tonicContract.getAssetsIn(testConfig.contractAddr);
        console.log("getAssetsIn", assetIn);

        for (var i = 0; i < assetIn.length; i++) {

          const assetContract = new ethers.Contract(assetIn[i],tokenABI,signer);

          const balance = await assetContract.balanceOf(testConfig.contractAddr);
          const symbol = await assetContract.symbol();
          const obj = {};
          obj.Address = assetIn[i];
          obj.Balance = balance;
          obj.Symbol = symbol;
          list.push(obj);
        }
        return list;
      }
    }
  }
</script>