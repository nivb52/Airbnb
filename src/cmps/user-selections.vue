<template>
  <section class="user-select">
    <el-dropdown>
      <span class="el-dropdown-link">
        <img
          class="user-menu-img burger"
          :src="require(`@/assets/imgs/icons/hamburger.png`)"
        />
        <img v-if="loggedInUser" class="user-menu-img" :src="userPic" />
        <img
          v-else
          class="user-menu-img"
          :src="require(`@/assets/imgs/icons/userGuest.jpg`)"
        />
      </span> 
      <el-dropdown-menu  slot="dropdown">
        <el-dropdown-item  
          class="user-option"
          v-if="!loggedInUser"
          @click.native="navTo"
          >Log-in</el-dropdown-item
        >
        <el-dropdown-item 
          class="user-option"
          v-if="loggedInUser"
          @click.native="navTo"
          >My profile</el-dropdown-item
        >
        <el-dropdown-item
          class="user-option"
          v-if="loggedInUser"
          @click.native="navTo"
          >Log-out</el-dropdown-item
        >
      </el-dropdown-menu>
      <router-link
        v-if="loggedInUser"
        class="router"
        :to="`/user/${loggedInUser._id}`"
      >
        <span
          v-if="loggedInUser && numOfUserMsgs"
          class="badge"
          title="New Message"
          >{{ numOfUserMsgs }}</span
        >
      </router-link>
    </el-dropdown>
  </section>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "Option1",
          label: "Option1",
        },
        {
          value: "Option2",
          label: "Option2",
        },
        {
          value: "Option3",
          label: "Option3",
        },
      ],
      value: "",
    };
  },
  methods: {
     navTo(ev) {
      console.log('click')
      switch (ev.target.textContent) {
        case "Notifications":
          if (this.$route.path !== "/notifications") {
            this.$router.push("/notifications");
          }
          break;
        case "Log-in":
          if (this.$route.path !== "/login") {
            this.$router.push("/login");
          }
          break;
        case "Log-out":
          if (this.$route.path !== "/") this.$router.push("/");
          this.$store.dispatch({ type: "logout" });
          break;
        case "My profile":
          console.log(this.$route.path);
          if (this.$route.path !== `/user/${this.loggedInUser._id}`) {
            this.$router.push(`/user/${this.loggedInUser._id}`);
          }
          break;
      }
    },
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    userPic() {
      return this.$store.getters.loggedinUser.imgUrl;
    },
    numOfUserMsgs() {
      // console.log(this.$store.getters.pendingOrders.length);
      return this.$store.getters.pendingOrders.length;

      //   const user = this.loggedInUser;
      // // const user = await this.$store.getters.loggedinUser
      // console.log(user, ' user')
      // var sum = 0;
      // for (const message in user.notifications){
      //   console.log(message, 'message')
      //   message.forEach(element => {
      //     if(element.status === 'unread'){
      //       sum++;
      //     }
      //   });
      // }
      // return sum;
    },
  }
};
</script>
