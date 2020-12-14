<template>
  <v-layout justify-center>
    <div class="page-width">
      <div style="width: 100%; height: 400px" class="d-flex">
        <div
          class="pt-1 pb-3 pl-3"
          style="width: 250px; height: 100%; background-color: #f0f3f4"
          v-show="$vuetify.breakpoint.lgAndUp"
        >
          <div
            v-for="danhMuc in danhMucs"
            :key="danhMuc.id"
            style="height: 43px"
          >
            <n-link :to="'/danhmuc/' + danhMuc.id" class="d-flex align-center">
              <v-avatar size="36">
                <img
                  :src="
                    danhMuc.anh_dai_dien
                      ? END_POINT_IMAGE + danhMuc.anh_dai_dien
                      : product
                  "
                />
              </v-avatar>
              <div
                :title="danhMuc.ten_danh_muc"
                class="danh-muc pr-2"
                style="
                  display: inline-block;
                  width: 100%;
                  white-space: nowrap;
                  overflow: hidden !important;
                  text-overflow: ellipsis;
                "
              >
                {{ danhMuc.ten_danh_muc }}
              </div>
            </n-link>
          </div>
        </div>

        <div style="height: 100%; object-fit: cover" class="flex-fill">
          <v-carousel
            height="400"
            cycle
            hide-delimiter-background
            show-arrows-on-hover
          >
            <v-carousel-item
              v-for="(item, i) in sliders"
              :key="i"
              reverse-transition="fade-transition"
              transition="fade-transition"
              @click="showPage(item)"
            >
              <div
                class="image-cover"
                :style="{
                  background: 'url(' + END_POINT_IMAGE + item.hinh_anh + ')'
                }"
                style="color: red; height: 100%"
              ></div>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div
          style="width: 300px; height: 100%; padding-left: 10px"
          class="khuyen-mai"
        >
          <div style="width: 290px; height: 195px; margin-top: 5px">
            <img
              :src="banner[0] ? END_POINT_IMAGE + banner[0].hinh_anh : ''"
              style="height: 193px; width: 290px; border-radius: 15px"
            />
          </div>

          <div style="width: 290px; height: 195px; margin-top: 5px">
            <v-img
              height="193px"
              style="border-radius: 15px"
             :src="banner[1] ? END_POINT_IMAGE + banner[1].hinh_anh : ''"
              aspect-ratio="1.7"
            ></v-img>
            <!-- <img
              src="http://apiruongbacthang.skymapglobal.vn/storage/images/avatar/1596775191.PNG"
              style="height: 193px; width: 290px; border-radius: 15px"
            /> -->
          </div>
        </div>
      </div>
      <div
        class="d-flex mt-5"
        style="justify-content: space-around; flex-wrap: wrap"
      >
        <div style="height: 80px;" class="d-flex align-center">
          <img :src="customerIcon" height="30" />
          <span class="text-icon">100.000 ++ KHÁCH HÀNG</span>
        </div>
        <div style="height: 80px" class="d-flex align-center">
          <img :src="refershIcon" height="30" />
          <span class="text-icon">ĐỔI TRẢ HÀNG, HOÀN TIỀN</span>
        </div>
        <div style="height: 80px" class="d-flex align-center">
          <img :src="cartIcon" height="30" />
          <span class="text-icon">GIAO HÀNG ĐÚNG GIỜ</span>
        </div>
        <div style="height: 80px" class="d-flex align-center">
          <img :src="shipIcon" height="30" />
          <span class="text-icon">MIỄN PHÍ GIAO HÀNG</span>
        </div>
      </div>
      <nuxt-child />
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

async function getDanhMuc() {
  let data = await api.get("danhmuckinhdoanh", { per_page: 9 }, false, false);
  return data.data.data;
}

export default {
  head: () => ({
    title: "Trang Chủ"
  }),
  data: () => ({
    danhMucs: [],
    END_POINT_IMAGE: END_POINT_IMAGE,
    product: product,
    customerIcon: customerIcon,
    refershIcon: refershIcon,
    cartIcon: cartIcon,
    shipIcon: shipIcon,
    sliders: [],
    banner: [],
  }),
  async asyncData({ params }) {
    let danhMucs = await getDanhMuc();
    return {
      danhMucs: danhMucs
    };
  },
  mounted() {
    this.getSlider();
    this.getBanner()
  },
  methods: {
    async getSlider() {
      let data = await api.get("slider");
      this.sliders = data.data;
    },
    async getBanner() {
      let data = await api.get("banner")
      this.banner = data.data
            console.log(this.banner)

    },
    clickDanhMuc(id) {
      this.$router.push("/danhmuc/" + id);
    },
    showPage(data) {
      if (data.link) {
        location.assign(data.link);
      }
    }
  }
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
  width: 250px;
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
