<template>
  <v-layout justify-center>
    <div class="page-width">
      <div style class="all-product">SINH THÁI RUỘNG BẬC THANG</div>
      <v-progress-linear color="green darken-2" rounded value="100"></v-progress-linear>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <div class="d-flex mt-6" v-for="baiViet in baiViets" :key="baiViet.id">
        <nuxt-link :to="'baiviet/' + baiViet.id">
        <div style="height: 150px; width: 250px;">
          <v-img
            :src="baiViet.anh_dai_dien ? END_POINT_IMAGE + baiViet.anh_dai_dien : product"
            aspect-ratio="1.7"
            height="150px"
            style="border-radius: 10px"
          ></v-img>
        </div>
        </nuxt-link>
        <div class="flex-fill c-flex pl-6">
          <nuxt-link :to="'baiviet/' + baiViet.id">
          <div style="font-weight: bold; font-size: 22px">{{baiViet.tieu_de}}</div>
          </nuxt-link>
          <!-- <div v-html="parseText(baiViet.noi_dung)"></div> -->
          <div class="noi-dung" style="text-align: justify; text-justify: inter-word;" v-if="baiViet.noi_dung.length > 250">{{baiViet.noi_dung.substr(0, 250)}}...</div>
          <div class="noi-dung" v-else style="text-align: justify; text-justify: inter-word;">{{baiViet.noi_dung}}</div>
          <div class="d-flex align-center mt-4">
            <v-avatar color="indigo">
              <img v-if="baiViet.user.avatar_url" :src="END_POINT_IMAGE + baiViet.user.avatar_url" alt="John" />
              <span v-else class="white--text headline">{{baiViet.user.name.charAt(0)}}</span>
            </v-avatar>
            <div class="ml-3" style="font-weight: bold; font-size: 16px"><span class="noi-dung" style="font-size: 14px; font-style: italic; font-weight: normal">Đăng bởi: </span>{{baiViet.user.name}}</div>
            <div class="ml-3 noi-dung" style="font-style: italic; font-size: 14px">Lúc {{formatDatetime(baiViet.created_at)}}</div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="total_page"
          circle
          @input="PaginateSanPham"
          :total-visible="9"
        ></v-pagination>
      </div>
    </div>
  </v-layout>
</template>

<script>
import md from "marked";

import api from "@/api";
import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
export default {
  data: () => ({
    baiViets: [],
    END_POINT_IMAGE: END_POINT_IMAGE,
    page: 1,
    per_page: 20,
    total_page: 1,
    loadSanPham: true,
    product: product,
    snackbar: false,
    noiDung: "",
    test: "green",
  }),
  mounted() {
    this.getBaiViet();
  },
  methods: {
    async getBaiViet() {
      this.loadSanPham = true;
      let data = await api.get("baiviet", {
        per_page: this.per_page,
        page: this.page,
      });
      this.baiViets = data.data.data.data;

      this.total_page = data.data.data.last_page;
      this.page = data.data.data.current_page;
      this.loadSanPham = false;
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
    parseText(text) {
      if (text) {
        if (text.length > 230) {
          text = text.substr(0, 230);
        }
        return md.parse(text);
      } else return null;
    },
    PaginateSanPham(val) {
      this.page = val;
      this.getBaiViet();
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
  },
};
</script>
<style scoped>
.d-flex {
  display: flex;
  flex-direction: row;
}
.danh-muc {
  font-size: 14px;
  font-weight: bold;
  margin-left: 15px;
}
.text-icon {
  font-size: 13px;
  font-weight: bold;
  padding-left: 15px;
}
.all-product {
  margin-top: 50px;
  font-size: 22px;
  color: green;
}
.san-pham {
  max-width: 250px;
}
@media only screen and (max-width: 600px) {
  .khuyen-mai {
    display: none;
  }
  .text-icon {
    font-size: 10px;
  }
  .ten-sanpham {
    font-size: 14px;
  }
  .all-product {
    font-size: 24px;
    margin-left: 10px;
  }
  .san-pham {
    max-width: 170px;
  }
  .gio-hang {
    display: none;
  }
  .noi-dung {
    display: none
  }
}
</style>
