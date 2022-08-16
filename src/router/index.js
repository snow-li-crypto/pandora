import VueRouter from 'vue-router'
import MyBorrow from "@/views/MyBorrow.vue";
import WallectConnect from "@/views/WallectConnect.vue";
// import MyToken from "@/views/MyToken.vue";
import MyToken2 from "@/views/MyToken2.vue";
import MyAsset from "@/views/MyAsset.vue";


const routes = [
  {
    path: "/",
    name: "WallectConnect",
    component: WallectConnect,
  },
  {
    path: "/myBorrow",
    name: "MyBorrow",
    component: MyBorrow,
  },
  {
    path: "/myToken",
    name: "myToken",
    component: MyToken2,
  },
  {
    path: "/myAsset",
    name: "myAsset",
    component: MyAsset,
  }
];

const router = new VueRouter({
    routes
})

// const router = VueRouter.createRouter({
//     // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
//     history: VueRouter.createWebHashHistory(),
//     routes, // `routes: routes` 的缩写
//   })

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

export default router;