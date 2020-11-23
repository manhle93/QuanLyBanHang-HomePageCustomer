<template>
  <v-layout justify-center>
    <div class="page-width">
      <div style="border-bottom: solid 1px green;" class="all-product">HÔM NAY ĂN GÌ ? ({{now}})</div>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <div
        style="margin-top: 50px; display: flex; flex-direction: row-reverse; flex-wrap: wrap;"
        v-else
       >
        <v-card
          class="mx-auto san-pham"
          v-for="(sanPham, index) in sanPhams"
          :key="index"
          style="margin-bottom: 40px"
        >
          <NuxtLink :to="'/homnayangi/' + sanPham.id">
            <v-img
              :src=" sanPham.anh_dai_dien ? END_POINT_IMAGE + sanPham.anh_dai_dien : product"
              :lazy-src="product"
              width="100%"
              height="200"
            >
            </v-img>
          </NuxtLink>

          <v-card-title
            style="height: 95px; color: #145A32"
            class="ten-sanpham"
          >{{ sanPham.ten }}</v-card-title>
          <v-card-subtitle class="d-flex align-center" style="justify-content: space-between">
            <span
              style="color: #764B09; font-size: 16px; font-weight: bold"
            >Cho {{ formatCurrency(sanPham.so_nguoi_an) }} người</span>
            <v-btn
              icon
              @click="addSanPhamYeuThich(sanPham.id)"
              color="green"
            >
              <v-icon large>mdi-food</v-icon>
            </v-btn>
          </v-card-subtitle>
        </v-card>
      </div>
    </div>
  </v-layout>
</template>

<script>
import api from "@/api";
import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
export default {
  data: () => ({
    sanPhams: [{ danh_muc: { ten_danh_muc: "Danh mục" } }],
    danhMucs: [],
    tenDanhMuc: "",
    END_POINT_IMAGE: END_POINT_IMAGE,
    page: 1,
    per_page: 20,
    total_page: 1,
    loadSanPham: true,
    product: product,
    now: "",
  }),
  watch: {},
  mounted() {
    this.getSanPham();
    let d = new Date();
    let month = +d.getUTCMonth() + 1;
    let day = d.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    this.now = day + "/" + month + "/" + d.getUTCFullYear();
  },
  methods: {
    async getSanPham() {
      let product = JSON.parse(localStorage.getItem("san_pham_yeu_thich"));
      this.loadSanPham = true;
      let data = await api.get("trangchuhomnayangi");
      this.sanPhams = data.data
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
  width: 250px;
}
.all-product {
  margin-top: 40px;
  font-size: 20px;
  color: green;
  /* font-weight: bold; */
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
