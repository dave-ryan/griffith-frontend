<template>
  <div class="container-fluid ps-0 pe-0 mb-5 text-center">
    <Splash
      :src="splashSrc"
      :pageLoaded="pageLoaded"
      @splashImgLoaded="splashImgLoaded = true"
    />
    <transition name="content" mode="out-in">
      <div v-if="pageLoaded && splashImgLoaded" class="ps-3 pe-3 mt-5">
        <div class="row">
          <div class="col"></div>
          <div class="col-lg-10">
            <div>
              Share your list with a friend!
              {{ this.currentUser?.share_code }}
              <div class="btn btn-warning" @click="generateShareLink">
                Generate New Link
              </div>
            </div>
            <transition-group name="content" mode="out-in">
              <h2 v-if="!myList.length" class="mb-5">
                Nothing on your list yet!
              </h2>
              <div v-if="myList.length" class="table-responsive">
                <h2 class="mt-2 mb-5">
                  Your {{ christmasTime ? "Christmas" : "Birthday" }} List
                </h2>
                <table class="table table-striped">
                  <thead class="table-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">What You Wish For</th>
                      <th scope="col">Link</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(gift, index) in myList"
                      :key="gift.id"
                      class="align-middle"
                    >
                      <td scope="row" style="width: 1%">
                        {{ index + 1 }}
                      </td>
                      <td
                        class="text-truncate"
                        style="max-width: 150px; min-width: 200px"
                      >
                        {{ gift.name }}
                      </td>
                      <td
                        class="text-truncate"
                        style="max-width: 150px; min-width: 200px"
                      >
                        <a
                          v-if="gift.link"
                          :href="`//` + gift.link.replace(/^https?:\/\//, '')"
                          alt=""
                          target="_blank"
                          >{{ gift.link }}</a
                        >
                      </td>
                      <td style="width: 1%" class="pe-0">
                        <button
                          type="button"
                          class="btn btn-outline-success"
                          data-bs-toggle="modal"
                          data-bs-target="#editModal"
                          @click="editGift(gift)"
                        >
                          Edit
                        </button>
                      </td>
                      <td style="width: 1%" class="ps-0">
                        <button
                          class="btn btn-outline-danger ms-2"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModal"
                          @click="deletingGift = gift"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </transition-group>
          </div>
          <div class="col"></div>
        </div>
        <div class="row">
          <div class="col"></div>
          <div class="col-12 col-sm-8 col-md-6 col-lg-4">
            <form
              @submit.prevent="createGift"
              id="newGiftForm"
              class="mt-4 mb-4"
              novalidate
            >
              <h5 class="mb-2">
                Add To Your {{ christmasTime ? "Christmas" : "Birthday" }} List
              </h5>
              <div class="form-floating mb-2">
                <input
                  v-model="newGift.name"
                  class="form-control"
                  required
                  id="newGiftName"
                  placeholder="books"
                  autocomplete="off"
                  :disabled="newGiftLoading"
                />
                <label class="pt-1" for="newGiftName">Name/Description</label>
                <div class="invalid-feedback">
                  What Do You Want For
                  {{ christmasTime ? "Christmas" : "Your Birthday" }}?
                </div>
              </div>
              <Spinner :visible="newGiftLoading" position="absolute" />
              <div class="form-floating mb-2">
                <input
                  v-model="newGift.link"
                  class="form-control"
                  id="newGiftLink"
                  placeholder="example.com"
                  autocomplete="off"
                  :disabled="newGiftLoading"
                />
                <label class="pt-1" for="newGiftLink">
                  Online Shopping Link<span class="fw-light ms-1"
                    >(optional)</span
                  >
                </label>
              </div>
              <div class="d-grid ms-5 me-5">
                <button class="btn btn-success" type="submit">
                  {{ newGiftLoading ? "Loading..." : "Add It!" }}
                </button>
              </div>
            </form>
          </div>
          <div class="col"></div>
        </div>
        <div class="d-flex justify-content-center">
          <hr class="w-75 fw-light" />
        </div>
        <button
          type="button"
          class="btn btn-outline-success p-4 mt-4"
          data-bs-toggle="modal"
          data-bs-target="#batchModal"
        >
          Add Multiple Things To Your List At Once
        </button>

        <!-- Edit Modal -->
        <div
          class="modal fade"
          id="editModal"
          tabindex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div class="modal-dialog modal-dialog-centered" id="editingModal">
            <div class="modal-content">
              <form
                @submit.prevent="updateGift"
                id="editingGiftForm"
                novalidate
              >
                <div class="modal-header">
                  <h3
                    class="modal-title text-truncate"
                    id="editModalLabel"
                    style="max-width: 400px"
                  >
                    {{ editingGift.name }}
                  </h3>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div class="modal-body">
                  <div class="form-floating mb-2">
                    <input
                      v-model="editingGift.name"
                      class="form-control"
                      required
                      id="editGiftName"
                      placeholder="books"
                      autocomplete="off"
                    />
                    <label class="pt-1" for="editGiftName"
                      >Name/Description</label
                    >

                    <div class="invalid-feedback">
                      What Do You Want For
                      {{ christmasTime ? "Christmas" : "Your Birthday" }}?
                    </div>
                  </div>

                  <div class="form-floating mb-2">
                    <input
                      v-model="editingGift.link"
                      class="form-control"
                      id="editGiftLink"
                      placeholder="example.com"
                      autocomplete="off"
                    />
                    <label class="pt-1" for="editGiftLink">
                      Online Shopping Link<span class="fw-light ms-1"
                        >(optional)</span
                      >
                    </label>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    class="btn btn-success disabled"
                    data-bs-dismiss="modal"
                    v-if="!editingGift.name"
                  >
                    Save Changes
                  </button>
                  <button
                    type="submit"
                    class="btn btn-success"
                    data-bs-dismiss="modal"
                    v-if="editingGift.name"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Delete Modal -->
        <div
          class="modal fade"
          id="deleteModal"
          tabindex="-1"
          data-bs-backdrop="static"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header text-center">
                <div class="text-danger w-100 display-6">WARNING!</div>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div class="modal-body">
                <div class="fw-bold">Are you sure you want to delete</div>
                <div class="text-truncate" style="max-width: 450px">
                  {{ deletingGift.name }}
                </div>
                <div class="fw-bold">from your wishlist?</div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="btn btn-danger"
                  data-bs-dismiss="modal"
                  @click="deleteGift(deletingGift)"
                >
                  Delete The gift
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Batch add Modal -->
        <div
          class="modal fade"
          id="batchModal"
          tabindex="-1"
          data-bs-backdrop="static"
        >
          <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <div class="container-fluid">
                  <h4 class="fw-bold text-center mt-2">
                    Add Gifts One Line At A Time
                  </h4>
                </div>
                <button
                  ref="Close"
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  :disabled="batchGiftsLoading"
                ></button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col mb-3 fw-light">
                    If you have online links (they are optional), make sure they
                    line up.
                    <br />
                    See the example below..
                  </div>
                </div>
                <Spinner
                  :visible="batchGiftsLoading"
                  position="absolute"
                  top="50%"
                />
                <div class="row">
                  <div class="col-6">
                    <h4>
                      <label for="floatingTextarea-Gift" class="fw-bold"
                        >What You Wish For</label
                      >
                    </h4>
                  </div>
                  <div class="col-6">
                    <h4>
                      <label for="floatingTextarea-Link" class="fw-bold"
                        >Online Shopping Links</label
                      >
                    </h4>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6 pe-1">
                    <div class="input">
                      <textarea
                        class="form-control batch"
                        :class="isWrappingTextGifts"
                        placeholder="Socks&#10;Throw pillows&#10;Marvel Blurays"
                        id="floatingTextarea-Gift"
                        v-model="batchGifts"
                        :disabled="batchGiftsLoading"
                      >
                      </textarea>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="input">
                      <textarea
                        class="form-control batch"
                        :class="isWrappingTextLinks"
                        placeholder="socks.com&#10;&#10;g.com/blurays"
                        id="floatingTextarea-Link"
                        v-model="batchLinks"
                        :disabled="batchGiftsLoading"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  :disabled="batchGiftsLoading"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="btn btn-success"
                  @click="batchCreate"
                  :disabled="batchGiftsLoading"
                >
                  {{ batchGiftsLoading ? "Loading..." : "Add All Gifts!" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.form-control.batch {
  min-height: 50vh;
}
textarea {
  white-space: pre-wrap;
}
</style>

<script>
import axios from "axios";
import Splash from "../components/Splash";
import Spinner from "../components/Spinner";
import christmasPresents from "../assets/images/presents-cropped-compressed.jpg";
import birthdayPresents from "../assets/images/birthday-presents.jpg";
import { nextTick } from "vue";

export default {
  components: { Splash, Spinner },
  props: ["christmasTime", "currentUser"],
  emits: ["onError", "clearError", "logOut", "onUserLoad"],
  data() {
    return {
      myList: [],
      newGift: {},
      newGiftLoading: false,
      editingGift: {},
      deletingGift: {},
      batchGifts: "",
      batchLinks: "",
      batchGiftsLoading: false,
      maxBatch: 25,
      splashImgLoaded: false,
      splashSrc: this.christmasTime ? christmasPresents : birthdayPresents,
      pageLoaded: false,
    };
  },
  computed: {
    isDisabled() {
      if (!this.newGift.name || this.newGift.name === "") {
        return true;
      } else {
        return false;
      }
    },
    isWrappingTextGifts() {
      if (this.batchGifts === "" || this.batchGiftsLoading) {
        return "";
      } else {
        return "text-prewrap";
      }
    },
    isWrappingTextLinks() {
      if (this.batchLinks === "" || this.batchGiftsLoading) {
        return "";
      } else {
        return "text-prewrap";
      }
    },
  },
  created() {
    this.$emit("clearError");
    this.getMe();
  },
  methods: {
    batchCreate() {
      this.batchGiftsLoading = true;
      var gift = this.batchGifts.split("\n");
      if (gift.length > this.maxBatch) {
        var error = {
          message: `Don't be greedy!! Maximum ${this.maxBatch} at a time`,
        };
        this.$emit("onError", error);
        this.batchGiftsLoading = false;
        return false;
      }
      var links = this.batchLinks.split("\n");
      var giftObjects = [];
      for (let i = 0; i < gift.length; i++) {
        if (gift[i] !== "") {
          giftObjects.push({
            name: gift[i],
            link: links[i],
            loaded: false,
          });
        }
      }

      for (let i = 0; i < giftObjects.length; i++) {
        axios
          .post("/gifts", giftObjects[i])
          .then((response) => {
            giftObjects[i].id = response.data?.id;
            giftObjects[i].created = true;
            this.myList.push(giftObjects[i]);
            if (giftObjects.every(this.checkCreated)) {
              this.hideBatchModal();
            }
          })
          .catch((error) => {
            error.function = "batchCreate";
            this.$emit("onError", error);
            this.hideBatchModal();
          });
        setTimeout(() => {}, 50);
      }
    },
    checkCreated(gift) {
      return gift.created;
    },
    checkForms(input) {
      if (input["name"] && input["name"].length > 0) {
        return true;
      } else {
        return false;
      }
    },
    createGift() {
      document.getElementById("newGiftForm").classList.add("was-validated");
      if (this.checkForms(this.newGift)) {
        this.newGiftLoading = true;
        axios
          .post("/gifts", this.newGift)
          .then((response) => {
            this.myList.push(response.data);
            this.newGift = {};
            this.newGiftLoading = false;
            this.$nextTick(() =>
              document.getElementById("newGiftName").focus()
            );
            document
              .getElementById("newGiftForm")
              .classList.remove("was-validated");
          })
          .catch((error) => {
            this.newGiftLoading = false;
            error.function = "createGift";
            this.$emit("onError", error);
          });

        setTimeout(() => {
          window.scrollTo(
            0,
            document.body.scrollHeight || document.documentElement.scrollHeight
          );
        }, 400);
      }
    },
    deleteGift(gift) {
      axios
        .delete(`/gifts/${gift.id}`)
        .then(() => {
          this.myList.splice(this.myList.indexOf(gift), 1);
        })
        .catch((error) => {
          error.function = "deleteGift";
          this.$emit("onError", error);
        });
    },
    editGift(gift) {
      this.editingGift.name = gift.name;
      this.editingGift.link = gift.link;
      this.editingGift.id = gift.id;
    },
    getMe() {
      axios
        .get("/current-user")
        .then((response) => {
          this.$emit("onUserLoad", response.data);
          this.getMyList();
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            this.$emit("logOut");
          } else {
            error.critical = true;
            error.function = "getMe";
            this.$emit("onError", error);
          }
        });
    },
    getMyList() {
      axios
        .get("/gifts")
        .then((response) => {
          this.pageLoaded = true;
          this.myList = response.data?.sort(function (a, b) {
            return a.id - b.id;
          });
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            this.$emit("logOut");
          } else {
            error.function = "getMyList";
            error.critical = true;
            this.$emit("onError", error);
          }
        });
    },
    generateShareLink() {
      axios
        .put("/generate-share-code")
        .then((response) => {
          this.$emit("onUserLoad", response.data);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            this.$emit("logOut");
          } else {
            error.critical = true;
            error.function = "getMe";
            this.$emit("onError", error);
          }
        });
    },
    async hideBatchModal() {
      this.batchGiftsLoading = false;
      this.batchGifts = "";
      this.batchLinks = "";
      await nextTick();
      this.$refs.Close.click();
    },
    updateGift() {
      document.getElementById("editingGiftForm").classList.add("was-validated");
      if (this.checkForms(this.editingGift)) {
        axios
          .patch(`/gifts/${this.editingGift.id}`, this.editingGift)
          .then(() => {
            document
              .getElementById("editingGiftForm")
              .classList.remove("was-validated");
            var foundGift = this.myList.find(
              (gift) => gift.id === this.editingGift.id
            );

            foundGift.name = this.editingGift.name;
            foundGift.link = this.editingGift.link;
          })
          .catch((error) => {
            error.function = "updateGift";
            this.$emit("onError", error);
          });
      }
    },
  },
};
</script>
