<template>
  <section class="host-stays-headline">
    <h2 class="assets-title">{{ userName }} Assets :</h2>
    <ul v-if="stays" class="host-stays">
      <li v-for="stay in stays" :key="stay._id" class="host-stay-and-orders">
        <div class="host-stay flex">
          <div class="host-stay-img-container">
            <img
              class="host-stay-img"
              :src="require(`@/assets/imgs/airbnb-imgs/${stay.imgUrls[0]}.jpg`)"
              alt="img not found"
            />
          </div>
          <div class="host-stay-txt">
            <h2>{{ stay.name }}</h2>
            <single-stay-order :stay="stay" />
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import singleStayOrder from "../cmps/single-stay-order";

export default {
  name: "host-stays",
  props: ["host"],
  computed: {
    stays() {
      //TODO do filter in store
      return this.$store.getters.staysForDisplay.filter((stay) => {
        return stay.host._id === this.host._id;
      });
    },
    userName() {
      return this.$store.getters.loggedinUser.fullname;
    },
  },
  components: {
    singleStayOrder,
  },
  async created() {
    await this.$store.dispatch({ type: "loadStays" });
    console.log(this.$store.getters.staysForDisplay);
  },
};
</script>
<style>
</style>