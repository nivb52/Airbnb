<template>
  <section class="stay-google-map">
    <h2>Location</h2>
    <GmapMap
      class="google-map"
      ref="gMap"
      :center="position"
      :zoom="zoom"
      map-type-id="terrain"
      style="width: 100%; height: 500px"
    >
      <GmapMarker
        :position="position"
        :clickable="true"
        :draggable="true"
        @click="centerMap(position)"
      />
      <GmapInfoWindow></GmapInfoWindow>
    </GmapMap>
  </section>
</template>

<script>
export default {
  name: "stay-map",
  props: {
    location: Object,
  },
  data() {
    return {
      zoom: 12,
      position: {
        lat: this.location.lat,
        lng: this.location.lng,
      },
    };
  },
  methods: {
    centerMap(pos) {
      zoom: 4, this.$refs.gMap.panTo(pos);
    },
  },
  created() {
    this.position.lng = this.location.lng;
    this.position.lat = this.location.lat;
  },
};
</script>