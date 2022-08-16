<template>
  <div id="nav">

      <!-- <div>
        <b-nav>
          <b-nav-item active><router-link to="/">Home</router-link> </b-nav-item>
          <b-nav-item> <router-link to="/about">About</router-link> </b-nav-item>
        </b-nav>
      </div> -->
      
      <div>
        <b-nav tabs>
          <b-nav-item active> <router-link to="/">WallectConnect</router-link>  </b-nav-item>
          <b-nav-item active> <router-link to="/myToken">MyToken</router-link>  </b-nav-item>
          <b-nav-item active> <router-link to="/myAsset">MyAsset</router-link>  </b-nav-item>
          <b-nav-item> <router-link to="/myBorrow">MyBorrow</router-link>  </b-nav-item>
        </b-nav>
      </div>

      <router-view></router-view>
  </div>
</template>


<!-- <template>
  <router-view></router-view>
</template> -->

<script>
export default {
}
</script>