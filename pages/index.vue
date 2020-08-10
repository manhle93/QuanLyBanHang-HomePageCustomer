<template>
  <v-layout justify-center>
    <div class="page-width">
      <Slider/>
      <div style class="all-product">TOÀN BỘ SẢN PHẨM</div>
      <v-progress-linear color="green darken-2" rounded value="100"></v-progress-linear>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <div
        style="margin-top: 50px; display: flex; flex-direction: row-reverse; flex-wrap: wrap;"
        v-else
      >
        <v-card
          class="mx-auto san-pham"
          v-for="sanPham in sanPhams"
          :key="sanPham.id"
          style="margin-bottom: 40px"
        >
          <NuxtLink :to="'/sanpham/'+sanPham.id">
            <v-img
              :src="sanPham.anh_dai_dien ? END_POINT_IMAGE + sanPham.anh_dai_dien : product"
              width="100%"
              height="200"
            ></v-img>
            <v-card-title style="height: 95px" class="ten-sanpham">{{sanPham.ten_san_pham}}</v-card-title>
            <v-card-subtitle>{{formatCurrency(sanPham.gia_ban)}} VNĐ</v-card-subtitle>
            <!-- <v-card-actions>
              <v-btn class="ma-1 mt-0" outlined color="green">
                <v-icon left>mdi-cart</v-icon>THÊM VÀO GIỎ
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>-->
          </NuxtLink>
        </v-card>
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
import api from "@/api";
import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
export default {
  layout: "header",
  data: () => ({
    sanPhams: [],
    danhMucs: [],
    END_POINT_IMAGE: END_POINT_IMAGE,
    page: 1,
    per_page: 20,
    total_page: 1,
    loadSanPham: true,
    product: product,
    sliders: [
      {
        src:
          "https://znews-photo.zadn.vn/w660/Uploaded/lce_qdhuc/2019_04_20/thumb1.jpg",
      },
      {
        src:
          "https://image.winudf.com/v2/image1/Z3NleHkuaG90Z2lybHMuZ2FpeGluaC5nc2V4eV9zY3JlZW5fNl8xNTQ0OTQ5NTkxXzA0MA/screen-6.jpg?fakeurl=1&type=.jpg",
      },
      {
        src:
          "https://thuthuatnhanh.com/wp-content/uploads/2018/07/anh-girl-xinh-gai-dep.jpg",
      },
    ],
  }),
  mounted() {
    this.getSanPham();
  },
  methods: {
    async getSanPham() {
      this.loadSanPham = true;
      let data = await api.get("sanpham", {
        per_page: this.per_page,
        page: this.page,
      });
      this.sanPhams = data.data.data.data;
      this.total_page = data.data.data.last_page;
      this.page = data.data.data.current_page;
      this.loadSanPham = false;
    },
    PaginateSanPham(val) {
      this.page = val;
      this.getSanPham();
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
  font-size: 13px;
  font-weight: bold;
  padding-left: 15px;
}
.all-product {
  margin-top: 50px;
  font-size: 26px;
  font-weight: bold;
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
}
</style>