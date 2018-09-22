<template>
  <div id="search">
    <i v-on:click="$router.go(-1)" class="fa fa-arrow-left"></i>
    <input id="searchInput" type="text" placeholder="Search" v-model="searchString" v-on:keyup.enter="initSearch()"/><span id="searchBtnContainer">
      <a id="searchBtn">
        <i class="fa fa-search"></i>
      </a>
    </span>
  </div>
</template>

<script>
  import store from "@/vuex/store"
  import 'font-awesome/css/font-awesome.css'
  export default {
    data() {
      return {
        searchString: ""
      }
    },
    methods: {
      initSearch: function() {
        if (this.searchString) {
          this.$router.push({name: 'Search', params: {searchString: this.searchString}})
        } else {
          this.$router.go(-1)
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../assets/scss/colors.scss';

  .row,
  .columns {
    margin: 0;
    padding: 0;
  }

  * {
    transition: 0.2s;
  }

  h1,
  p,
  div {
    font-family: "Roboto", sans-serif;
  }

  ::-webkit-scrollbar {
    width: 0.5rem;
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: lighten($background, 10%);
    border-radius: 5rem;
  }
  i {
    color: white;
  }
  div#search {
    height: 10vh;
    width: 60vw;
    padding: 1rem;
    margin-left: 18%;
    background: transparent;
  }
  input#searchInput {
    width: 90%;
    padding: 0.75rem;
    padding-left: 1rem;
    border: 1px solid transparent;
    border-top-left-radius: 5rem;
    border-bottom-left-radius: 5rem;
    background-color: lighten($background, 10%);
    color: white;
  }
  input#searchInput:focus {
    outline: none;
  }
  span#searchBtnContainer {
    padding: 0.75rem;
    padding-right: 1rem;
    background-color: lighten($background, 10%);
    color: white;
    border-top-right-radius: 5rem;
    border-bottom-right-radius: 5rem;
    vertical-align: middle;
  }
</style>
