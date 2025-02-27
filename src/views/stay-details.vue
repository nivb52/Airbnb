<template>
  <section v-if="stay" class="stay-details-container main-layout layout-change">
    <div class="full-width img-container">
    <stay-img-gallery @toggleLike="toggleLike()" class="img-gallery stay-details-img-carousel-container full-width" :imgs="stay.imgUrls" :isLiked="this.isLiked"/>
    <div class="heart-btn">
      <img
        v-if="!isLiked"
        title="Save To Favorites"
        @click="toggleLike()"
        class="like-btn"
        src="../assets/imgs/icons/heart.png"
      />
      <img
        v-else
        title="Remove From Favorites"
        @click="toggleLike()"
        class="like-btn"
        src="../assets/imgs/icons/fillheart.png"
      />
    </div> 
    </div>
    <div class="stay-details-title flex column">
      <div class="stay-title-primary">{{ stay.summary }}</div>
      <div class="stay-title-secondary flex space-between center">
        <div class="left flex space-between center">
          <star-rating :reviews="this.reviews" /> <span> · </span>
          <a class="link" href="#location">{{
            stay.loc.address
          }}</a>
        </div>
        <div class="right flex space-between">
          <button class="btn flex center space-evenly action-btn">
            <i class="share-btn btn fas fa-share-square"></i><span>Share</span>
          </button>
          <button
            class="btn flex center space-evenly action-btn"
            v-if="isLiked"
            @click="toggleLike()"
          >
            <i class="save-btn btn fas fa-heart" style="color: #ca4c4c"></i
            ><span>Save</span>
          </button>
          <button
            class="btn flex center space-evenly action-btn"
            v-if="!isLiked"
            @click="toggleLike()"
          >
            <i class="save-btn btn far fa-heart"></i><span>Save</span>
          </button>
        </div>
      </div>
    </div>
    <stay-img-gallery class="img-gallery img-grid-wide-view" :imgs="stay.imgUrls" />
    <div class="flex space-between stay-description-wrapper">
      <div class="bottom-border stay-description">
        <div class="flex space-between bottom-border stay-desctiption-title">
          <div>
            <h2 class="hosted-by">{{ stay.name }} hosted by {{ stay.host.fullname }}</h2>
            <p>Up to {{ guestAmount }}</p>
          </div>
          <img class="thumb-img" :src="stay.host.imgUrl" />
        </div>
        <div class="description-section flex column bottom-border">
          <div class="description-txt">
            Come to discover my appartment in the middle of
            {{ stay.loc.address }}. It is located in near the park and close to
            several bus stations. This apartment can accommodate up to
            <span>{{ guestAmount }}</span> people, it is on the
            {{ stay.capacity + 3 }}th floor (with a large lift) and is very well
            equipped. This accommodation is surrounded by shops for shopping,
            bakeries, groceries but also restaurants and bars ... Do not
            hesitate any more!
          </div>
          <p class="contact-host-btn underline">Contact Host</p>
        </div>
        <div>
          <stay-amenities :stay="stay" />
        </div>
      </div>
      <trip-settings class="trip-settings" :stay="stay" />
    </div>

    <div class="review-section bottom-border">
      <review-categories :reviews="this.reviews" />
      <review-list :reviews="this.reviews" />
      <review-add @postReview="postReview"></review-add>
    </div>

    <stay-map id="location" :location="stay.loc" />
  <trip-settings-mobile class="trip-settings-mobile full-width" :stay="stay" />
  </section>
</template> 
 
<script>
import stayAmenities from "../cmps/stay-amenities.vue";
import stayImgGallery from "../cmps/stay-img-gallery.vue";
import tripSettings from "../cmps/trip-settings.vue";
import tripSettingsMobile from "../cmps/trip-settings-mobile.vue";
import reviewList from "../cmps/review-list.vue";
import reviewCategories from "../cmps/review-categories.vue";
import starRating from "../cmps/star-rating.vue";
import stayMap from "../cmps/stay-map.vue";
import { stayService } from "../services/stay.service.js";
import appChat from "../cmps/app-chat.vue";
import popUp from "../cmps/pop-up.vue";
import reviewAdd from "../cmps/review-add.vue";
import { socketService } from "../services/socket.service.js";

export default {
  name: "stay-details",
  data() {
    return {
      first: true,
      reviews: null,
      onChat: false,
      stay: null,
      contactHostMsg: "",
      review: {
        avgRate: null,
        category: {
          Cleanliness: null,
          Accuracy: null,
          Communication: null,
          Location: null,
          CheckIn: null,
          Accessibility: null,
        },
      },
      isLiked: null,
      stayOrders: [],
      buyer: null,
      host: null,
    };
  },
  methods: {
    open1() {
      if (this.first === false) return;
      this.first = false;
      this.$notify({
        title: `${this.stay.host.fullname} has ACCEPTED your Reservation`,
        message: `${this.buyer.fullname} Enjoy your trip in ${this.stay.loc.address} :)`,
        type: "success",
        position: "top-right",
        duration: 20000,
      });
    },
    contactHost() {
      var msg = {
        txt: this.contactHostMsg,
        buyerId: this.buyer._id,
        hostId: this.stay.host_id,
        stayId: this.stay._id,
        date: Date.now(),
      };
      this.$store.dispatch({ type: "contactHost", msg });
    },
    async postReview(postedReview) {
      var review = {
        txt: postedReview.reviewTxt,
        buyer: this.buyer,
        hostId: this.stay.host._id,// will be used in the future for updating host
        stay: this.stay,
        avgRate: postedReview.userReviewAvgRate,
        category: {
          Cleanliness: postedReview.categoryMap.Cleanliness,
          Accuracy: postedReview.categoryMap.Accuracy,
          Communication: postedReview.categoryMap.Communication,
          Location: postedReview.categoryMap.Location,
          CheckIn: postedReview.categoryMap.CheckIn,
          Accessibility: postedReview.categoryMap.Accessibility,
        },
      };
      try {
        const updatedStay = await this.$store.dispatch({
          type: "postReview",
          review,
        });
        this.stay = updatedStay;
      } catch (err) {
        console.log("could not update stay with new review:", err);
      }
    },
    async toggleLike() {
      this.isLiked = !this.isLiked;
      if (this.isLiked) {
        this.class = "save-btn btn fas fa-heart";
      } else {
        this.class = "save-btn btn far fa-heart";
      }
      await this.$store.dispatch({ type: "toggleLike", stay: this.stay });
    },

    //   async ToggleLike(stay) {
    //   if (!this.$store.getters.loggedinUser) {
    //     Swal.fire("Its better to sign in :)");
    //     return;
    //   }
    //   try {
    //     await this.$store.dispatch({ type: "toggleLike", stay });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
      // isLiked() {
      // const user = this.$store.getters.loggedinUser;
      // if (!user) return;
      // return this.stay.favorites.some(({userId}) => {
      //   return userId === user._id;
      // })
      // },
  },
  computed: {
    guestAmount() {
      if (this.stay.capacity > 1) {
        return this.stay.capacity.toString() + " guests";
      } else {
        return this.stay.capacity.toString() + " guest";
      }
    },
  },
  created() {
    const _id = this.$route.params.id;
    stayService.getById(_id).then((stay) => {
      if (stay) {
        this.stay = stay;
        this.stay.host._id;
        this.reviews = stay.reviews;
        this.$store.dispatch({ type: "loadAllOrders", stayId: stay._id });
      const user = this.$store.getters.loggedinUser;
        if (!user){
          this.isLiked=false;
        }else{
          this.isLiked= this.stay.favorites.some(({userId}) => {
                return userId === user._id;
          })
        }
      }
    });
    if (this.$store.getters.loggedinUser) {
      this.buyer = this.$store.getters.loggedinUser;
    }
    socketService.on("updatedAns", this.open1);
      },
  destroyed() {
    socketService.off("updatedAns");
  },
  components: {
    stayImgGallery,
    tripSettings,
    tripSettingsMobile,
    reviewList,
    stayService,
    stayMap,
    reviewCategories,
    starRating,
    stayAmenities,
    appChat,
    popUp,
    reviewAdd,
  },
};
</script>



