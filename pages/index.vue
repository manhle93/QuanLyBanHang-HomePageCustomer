<template>
  <v-layout justify-center>
    <div class="page-width">
      <div style="width: 100%; height: 400px;" class="d-flex">
        <div
          class="pt-1 pb-3 pl-3"
          style="width: 250px; height: 100%; background-color: #FCF3CF"
          v-show="$vuetify.breakpoint.lgAndUp"
        >
          <div v-for="danhMuc in danhMucs" :key="danhMuc.id" style="height: 43px">
            <NuxtLink :to="'/danhmuc/' + danhMuc.id" class="d-flex align-center">
              <v-avatar size="36">
                <img
                  :src="danhMuc.anh_dai_dien ? END_POINT_IMAGE + danhMuc.anh_dai_dien : product "
                />
              </v-avatar>
              <div class="danh-muc">{{danhMuc.ten_danh_muc}}</div>
            </NuxtLink>
          </div>
        </div>

        <div style="height: 100%; object-fit: cover;" class="flex-fill">
          <v-carousel height="400" cycle hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item
              v-for="(item,i) in sliders"
              :key="i"
              reverse-transition="fade-transition"
              transition="fade-transition"
            >
              <div
                class="image-cover"
                :style="{background: 'url(' + item.src + ')'}"
                style="color: red; height: 100%"
              ></div>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div style="width: 300px; height: 100%; padding-left: 10px" class="khuyen-mai">
          <div style="width: 290px; height: 195px; margin-top: 5px">
            <img
              src="https://t.a4vn.com/2018/10/3/bo-anh-hot-girl-xinh-dep-khoe-dang-tao-bao-voi-bikini-ab8.png"
              style="height: 193px; width: 290px; border-radius: 15px"
            />
          </div>

          <div style="width: 290px; height: 195px; margin-top: 5px">
            <img
              src="https://sohanews.sohacdn.com/thumb_w/660/160588918557773824/2020/7/11/photo1594457983445-15944579858362004055205.jpg"
              style="height: 193px; width: 290px; border-radius: 15px"
            />
          </div>
        </div>
      </div>
      <div class="d-flex mt-5" style="justify-content: space-around; flex-wrap: wrap">
        <div style="height: 80px;" class="d-flex align-center">
          <img :src="customerIcon" height="40" />
          <span class="text-icon">100.000 ++ KHÁCH HÀNG</span>
        </div>
        <div style="height: 80px" class="d-flex align-center">
          <img :src="refershIcon" height="40" />
          <span class="text-icon">ĐỔI TRẢ HÀNG, HOÀN TIỀN</span>
        </div>
        <div style="height: 80px" class="d-flex align-center">
          <img :src="cartIcon" height="40" />
          <span class="text-icon">GIAO HÀNG ĐÚNG GIỜ</span>
        </div>
        <div style="height: 80px" class="d-flex align-center">
          <img :src="shipIcon" height="40" />
          <span class="text-icon">MIỄN PHÍ GIAO HÀNG</span>
        </div>
      </div>
      <div style="margin-top: 50px; font-size: 26px; font-weight: bold">TOÀN BỘ SẢN PHẨM</div>
      <v-progress-linear color="green darken-2" rounded value="100"></v-progress-linear>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <div
        style="margin-top: 50px; display: flex; flex-direction: row-reverse; flex-wrap: wrap;"
        v-else
      >
        <v-card
          class="mx-auto"
          max-width="250"
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
            <v-card-title style="height: 95px">{{sanPham.ten_san_pham}}</v-card-title>
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
import customerIcon from "assets/image/icon/people.png";
import refershIcon from "assets/image/icon/refresh.png";
import cartIcon from "assets/image/icon/cart.png";
import shipIcon from "assets/image/icon/delivery.png";
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
    customerIcon: customerIcon,
    refershIcon: refershIcon,
    cartIcon: cartIcon,
    shipIcon: shipIcon,
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
    this.getDanhMuc();
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
    async getDanhMuc() {
      let data = await api.get("danhmuc", { per_page: 9 });
      this.danhMucs = data.data.data;
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
@media only screen and (max-width: 600px) {
  .khuyen-mai {
    display: none;
  }
  .text-icon {
    font-size: 10px;
  }
}
</style>