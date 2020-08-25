<template>
  <v-layout justify-center>
    <div class="page-width">
      <div class="all-product">Bài viết</div>
      <v-progress-linear color="green darken-2" rounded value="100"></v-progress-linear>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <div class="c-flex">
        <div style="font-weight: bold; font-size: 26px" class="mt-3">{{baiViet.tieu_de}}</div>
        <div class="d-flex align-center mt-4">
          <v-avatar color="indigo">
            <img
              v-if="baiViet.user.avatar_url"
              :src="END_POINT_IMAGE + baiViet.user.avatar_url"
              alt="John"
            />
            <span v-else class="white--text headline">{{baiViet.user.name.charAt(0)}}</span>
          </v-avatar>
          <div class="ml-3" style="font-weight: bold; font-size: 16px">
            <span style="font-size: 14px; font-style: italic; font-weight: normal">Đăng bởi:</span>
            {{baiViet.user.name}}
          </div>
          <div
            class="ml-3"
            style="font-style: italic; font-size: 14px"
          >Lúc {{formatDatetime(baiViet.created_at)}}</div>
        </div>
        <div class="mt-8">
          <v-img
            :src="END_POINT_IMAGE + baiViet.anh_dai_dien"
            aspect-ratio="1.7"
            style="border-radius: 15px"
          ></v-img>
        </div>
        <div class="mt-8">
          <div class="mo-ta" v-html="parseText(baiViet.noi_dung)"></div>
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script>
import api from "@/api";
import md from "marked";

import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
export default {
  data: () => ({
    baiViet: {
      user: {
        name: "Manh Le",
        avatar_url: null,
      },
    },
    tenDanhMuc: "",
    END_POINT_IMAGE: END_POINT_IMAGE,
    page: 1,
    per_page: 20,
    total_page: 1,
    loadSanPham: true,
    product: product,
  }),
  // watch: {
  //   $route(to, from) {
  //     this.getSanPham();
  //     this.getDanhMuc();
  //   },
  // },
  mounted() {
    this.getBaiViet();
  },
  methods: {
    async getBaiViet() {
      this.loadSanPham = true;
      let data = await api.get("baiviet/" + this.$route.params.id);
      this.baiViet = data.data;
      console.log(this.baiViet);
      this.loadSanPham = false;
    },
    formatCurrency(n, separate = ".") {
      try {
        if (!n) n = 0;
        var s = parseInt(n).toString();
        var regex = /\B(?=(\d{3})+(?!\d))/g;
        var ret = s.replace(regex, separate);
        return ret;
      } catch (error) {
        return "0";
      }
    },
    parseText(text) {
      if (text) {
        return md.parse(text);
      } else return null;
    },
    formatDatetime(time) {
      if (!time) {
        return "";
      }
      try {
        let d = new Date(time);
        let month = +d.getUTCMonth() + 1;
        let hours = +d.getUTCHours();
        let min = +d.getMinutes();
        if (month < 10) {
          month = "0" + month;
        }
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (min < 10) {
          min = "0" + min;
        }
        return (
          hours +
          ":" +
          min +
          " Ngày " +
          d.getDate() +
          "/" +
          month +
          "/" +
          d.getUTCFullYear()
        );
      } catch (error) {
        return "";
      }
    },
  },
};
</script>
<style scoped>
.danh-muc {
  font-size: 14px;
  font-weight: bold;
  margin-left: 15px;
}
.text-icon {
  font-size: 16px;
  font-weight: bold;
  padding-left: 15px;
}
.san-pham {
  max-width: 250px;
}
.all-product {
  margin-top: 50px;
  font-size: 26px;
  font-weight: bold;
}
@media only screen and (max-width: 600px) {
  .san-pham {
    max-width: 170px;
  }
  .all-product {
    font-size: 24px;
    margin-left: 10px;
  }
}
</style>
