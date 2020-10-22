<template>
  <v-layout justify-center>
    <v-snackbar v-model="snackbar" color="green">
      {{ noiDung }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
      </template>
    </v-snackbar>
    <div class="page-width">
      <div style="border-bottom: solid 1px green;" class="all-product">DANH SÁCH SẢN PHẨM</div>
      <v-text-field
        color="success"
        loading
        disabled
        v-if="loadSanPham"
      ></v-text-field>
      <div style="display: flex; flex-direction: column" v-else>
        <div
          style="margin-top: 50px; display: flex; flex-direction: column"
          v-for="(item, index) in dataSP"
          :key="index"
        >
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            "
          >
            <div class="ten-danhmuc mb-3 ml-1">{{ item.ten_danh_muc }}</div>
            <div
              class="mb-1 ten-danhmuc"
              style="font-size: 18px; font-style: normal"
            >
              {{ item.so_mat_hang }} Sản phẩm
            </div>
          </div>
          <v-progress-linear
            color="teal"
            rounded
            value="100"
          ></v-progress-linear>
          <br />
          <v-sheet class="mx-auto" elevation="8" max-width="100%">
            <v-slide-group
              v-model="model"
              class="pt-6 pb-6 pl-0"
              active-class="success"
              show-arrows
            >
              <v-slide-item
                v-for="(sanPham, index) in item.san_pham"
                :key="index"
              >
                <v-card class="mx-auto san-pham ma-5 mr-5 ml-3">
                  <NuxtLink :to="'/sanpham/' + sanPham.id">
                    <v-img
                      :src="
                        sanPham.anh_dai_dien
                          ? END_POINT_IMAGE + sanPham.anh_dai_dien
                          : product
                      "
                      :lazy-src="product"
                      width="100%"
                      height="200"
                    >
                    </v-img>
                  </NuxtLink>
                  <v-card-title
                    style="height: 95px; color: black;font-size: 16px;font-weight: normal"
                    class="ten-sanpham"
                    >{{ sanPham.ten_san_pham }}</v-card-title
                  >
                  <v-card-subtitle
                    class="d-flex align-center"
                    style="justify-content: space-between"
                  >
                    <span
                      style="color: red; font-size: 16px; font-weight: bold"
                      >{{ formatCurrency(sanPham.gia_ban) }} đ
                    </span>
                    <span style="color: black; font-size: 14px; font-weight: normal">
                      /{{sanPham.don_vi_tinh}} 
                    </span>

                    <v-btn
                      v-if="
                        sanPham.san_pham_ton_kho &&
                        sanPham.san_pham_ton_kho.so_luong > 0
                      "
                      color="green"
                      class="mx-2 gio-hang"
                      fab
                      dark
                      small
                      @click="addGioHang(sanPham.id)"
                    >
                      <v-icon>mdi-cart</v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      color="#9E9E9E"
                      class="mx-2 gio-hang"
                      fab
                      dark
                      small
                    >
                      <v-icon>mdi-cart</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      @click="addSanPhamYeuThich(sanPham.id)"
                      :style="{ color: sanPham.daYeuThich ? 'red' : 'gray' }"
                    >
                      <v-icon>mdi-heart</v-icon>
                    </v-btn>
                  </v-card-subtitle>
                </v-card>
              </v-slide-item>
            </v-slide-group>
            <div class="text-center mb-6">
              <nuxt-link :to="'/danhmuc/' + item.id">
                <v-btn class="ma-2" outlined color="green"> Xem tất cả </v-btn>
              </nuxt-link>
            </div>
          </v-sheet>
        </div>
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
    model: null,
    sanPhams: [],
    danhMucs: [],
    END_POINT_IMAGE: END_POINT_IMAGE,
    page: 1,
    dataSP: [],
    per_page: 20,
    total_page: 1,
    loadSanPham: true,
    product: product,
    snackbar: false,
    noiDung: "",
    test: "green",
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
    // this.getSanPham();
    this.getData();
  },
  methods: {
    async getSanPham() {
      let product = JSON.parse(localStorage.getItem("san_pham_yeu_thich"));
      this.loadSanPham = true;
      let data = await api.get("sanpham", {
        per_page: this.per_page,
        page: this.page,
      });
      this.sanPhams = data.data.data.data.map((e) => {
        e.daYeuThich = false;
        return e;
      });

      for (let item of this.sanPhams) {
        if (product && product.includes(item.id)) {
          item.daYeuThich = true;
        } else item.daYeuThich = false;
      }
      this.total_page = data.data.data.last_page;
      this.page = data.data.data.current_page;
      this.loadSanPham = false;
    },
    async getData() {
      let product = JSON.parse(localStorage.getItem("san_pham_yeu_thich"));
      this.loadSanPham = true;
      let data = await api.get("danhmucmobile");
      data.data.map((el) => {
        el.san_pham.map((it) => {
          it.daYeuThich = false;
        });
      });
      this.dataSP = data.data;
      this.dataSP.map((el) => {
        for (let item of el.san_pham) {
          if (product && product.includes(item.id)) {
            item.daYeuThich = true;
          } else item.daYeuThich = false;
        }
      });
      this.loadSanPham = false;
    },
    addGioHang(id) {
      let product = JSON.parse(localStorage.getItem("gio_hang"));
      if (!product) {
        product = [];
      }
      let sP = {};
      let check = product.find((el) => el.san_pham_id == id);
      if (check) {
        check.so_luong = check.so_luong + 1;
      } else {
        sP.so_luong = 1;
        sP.san_pham_id = id;
        product.push(sP);
      }

      let so_luong = 0;
      for (let item of product) {
        so_luong = Number(so_luong) + Number(item.so_luong);
      }
      this.snackbar = true;
      this.noiDung = "Đã thêm vào giỏ hàng";
      this.$store.commit("giohang/add", so_luong);
      localStorage.setItem("gio_hang", JSON.stringify(product));
    },

    addSanPhamYeuThich(id) {
      this.dataSP.map((it) => {
        let check = it.san_pham.find((el) => el.id == id);
        if (check) {
          it.san_pham.find((el) => el.id == id).daYeuThich = !check.daYeuThich;
        }
      });
      console.log("das", this.dataSP);
      let product = JSON.parse(localStorage.getItem("san_pham_yeu_thich"));
      if (!product) {
        product = [];
      }
      let sP = {};
      let check = product.findIndex((el) => el == id);
      if (check !== -1) {
        product.splice(check, 1);
      } else {
        product.push(id);
      }
      localStorage.setItem("san_pham_yeu_thich", JSON.stringify(product));
    },

    // checkSanPhamYeuThich(id) {
    //   console.log("dsa", id);
    //   let product = JSON.parse(localStorage.getItem("san_pham_yeu_thich"));
    //   if (!product) {
    //     product = [];
    //   }
    //   return product.includes(id);
    // },

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
  margin-top: 40px;
  font-size: 20px;
  color: green;
}
.san-pham {
  max-width: 240px;
}
.ten-danhmuc {
  color: green;
  /* font-style: italic; */
  /* font-weight: bold; */
  font-size: 20px;
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
}
</style>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
</style>
