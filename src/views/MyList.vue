<template>
  <div class="container-fluid ps-0 pe-0 mb-5 text-center">
    <Splash
      :src="splashSrc"
      :contentLoaded="contentLoaded"
      :pageLoaded="pageLoaded"
      @splashImgLoaded="splashImgLoaded = true"
    />
    <transition name="content" mode="out-in">
      <div v-if="contentLoaded && splashImgLoaded" class="ps-3 pe-3 mt-5">
        <div class="row">
          <div class="col"></div>
          <div class="col-lg-10">
            <div class="table-responsive">
              <h2 class="mt-2 mb-5">Your Christmas List</h2>
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
                    v-for="(item, index) in myList"
                    :key="item.id"
                    class="align-middle"
                  >
                    <td scope="row" style="width: 1%">
                      {{ index + 1 }}
                    </td>
                    <td
                      class="text-truncate"
                      style="max-width: 150px; min-width: 200px"
                    >
                      {{ item.name }}
                    </td>
                    <td
                      class="text-truncate"
                      style="max-width: 150px; min-width: 200px"
                    >
                      <a
                        v-if="item.link"
                        :href="`//` + item.link.replace(/^https?:\/\//, '')"
                        alt=""
                        target="_blank"
                        >{{ item.link }}</a
                      >
                    </td>
                    <td style="width: 1%" class="pe-0">
                      <button
                        type="button"
                        class="btn btn-outline-success"
                        data-bs-toggle="modal"
                        data-bs-target="#editModal"
                        @click="editItem(item)"
                      >
                        Edit
                      </button>
                    </td>
                    <td style="width: 1%" class="ps-0">
                      <button
                        class="btn btn-outline-danger ms-2"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        @click="deletingItem = item"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col"></div>
        </div>
        <div class="row">
          <div class="col"></div>
          <div class="col-12 col-sm-8 col-md-6 col-lg-4">
            <form
              @submit.prevent="createItem"
              id="newItemForm"
              class="mt-4 mb-4"
              novalidate
            >
              <h5 class="mb-2">Add To Your Christmas List</h5>
              <div class="form-floating mb-2">
                <input
                  v-model="newItem.name"
                  class="form-control"
                  required
                  id="newItemName"
                  placeholder="books"
                  autocomplete="off"
                  :disabled="newItemLoading"
                />
                <label class="pt-2" for="newItemName">Name/Description</label>
                <div class="invalid-feedback">
                  What Do You Want For Christmas?
                </div>
              </div>
              <transition mode="out-in">
                <Spinner v-if="newItemLoading" position="absolute" />
              </transition>
              <div class="form-floating mb-2">
                <input
                  v-model="newItem.link"
                  class="form-control"
                  id="newItemLink"
                  placeholder="example.com"
                  autocomplete="off"
                  :disabled="newItemLoading"
                />
                <label class="pt-2" for="newItemLink">
                  Online Shopping Link
                  <span class="fw-light ms-1">optional</span>
                </label>
              </div>
              <div class="d-grid ms-5 me-5">
                <button class="btn btn-success" type="submit">
                  {{ newItemLoading ? "Loading..." : "Add It!" }}
                </button>
              </div>
            </form>
          </div>
          <div class="col"></div>
        </div>
        <div class="row">
          <div class="col"></div>
          <div class="col-10 col-sm-8 col-md-6"><hr /></div>
          <div class="col"></div>
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
                @submit.prevent="updateItem"
                id="editingItemForm"
                novalidate
              >
                <div class="modal-header">
                  <h3
                    class="modal-title text-truncate"
                    id="editModalLabel"
                    style="max-width: 400px"
                  >
                    {{ editingItem.name }}
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
                      v-model="editingItem.name"
                      class="form-control"
                      required
                      id="editItemName"
                      placeholder="books"
                      autocomplete="off"
                    />
                    <label class="pt-2" for="editItemName"
                      >Name/Description</label
                    >

                    <div class="invalid-feedback">
                      What Do You Want For Christmas?
                    </div>
                  </div>

                  <div class="form-floating mb-2">
                    <input
                      v-model="editingItem.link"
                      class="form-control"
                      id="editItemLink"
                      placeholder="example.com"
                      autocomplete="off"
                    />
                    <label class="pt-2" for="editItemLink">
                      Online Shopping Link
                      <span class="fw-light ms-1">optional</span>
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
                    v-if="!editingItem.name"
                  >
                    Save Changes
                  </button>
                  <button
                    type="submit"
                    class="btn btn-success"
                    data-bs-dismiss="modal"
                    v-if="editingItem.name"
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
                  {{ deletingItem.name }}
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
                  @click="deleteItem(deletingItem)"
                >
                  Delete The Item
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
                    Add Items One Line At A Time
                  </h4>
                </div>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
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
                <div class="row">
                  <div class="col-6 pe-1">
                    <div class="input">
                      <h4>
                        <label for="floatingTextarea-Gift" class="fw-bold"
                          >What You Wish For</label
                        >
                      </h4>
                      <textarea
                        class="form-control batch"
                        :class="needsWordWrap(batchItems)"
                        placeholder="Socks&#10;Throw pillows&#10;Marvel Blurays"
                        id="floatingTextarea-Gift"
                        v-model="batchItems"
                      >
                      </textarea>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="input">
                      <h4>
                        <label for="floatingTextarea-Link" class="fw-bold"
                          >Online Shopping Links</label
                        >
                      </h4>
                      <textarea
                        class="form-control batch word-wrap"
                        :class="needsWordWrap(batchLinks)"
                        placeholder="socks.com&#10;&#10;g.com/blurays"
                        id="floatingTextarea-Link"
                        v-model="batchLinks"
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
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="btn btn-success"
                  data-bs-dismiss="modal"
                  @click="batchCreate"
                >
                  Add All Items!
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
import Splash from "../components/Splash.vue";
import Spinner from "../components/Spinner.vue";
import splashImage from "../assets/images/presents-cropped-compressed.jpg";

export default {
  components: { Splash, Spinner },
  emits: ["logOut", "onError", "clearError"],
  data() {
    return {
      myList: [],
      newItem: {},
      newItemLoading: false,
      editingItem: {},
      deletingItem: {},
      contentLoaded: false,
      batchItems: "",
      batchLinks: "",
      splashImgLoaded: false,
      splashSrc: splashImage,
      pageLoaded: false,
    };
  },
  computed: {
    isDisabled() {
      if (!this.newItem.name || this.newItem.name === "") {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.$emit("clearError");
  },
  mounted() {
    this.getMyList();
  },
  methods: {
    batchCreate() {
      var arrayOfItems = this.batchItems.split("\n");
      var arrayOfLinks = this.batchLinks.split("\n");
      for (let i = 0; i < arrayOfItems.length; i++) {
        if (arrayOfItems[i] != "") {
          let newItem = {
            name: arrayOfItems[i],
            link: arrayOfLinks[i],
          };
          axios
            .post("/wishedgifts", newItem)
            .then((response) => {
              newItem.id = response.data.id;
              this.myList.push(newItem);
            })
            .catch((error) => {
              error.function = "batchCreate";
              this.$emit("onError", error);
            });
        }
      }
      this.batchItems = "";
      this.batchLinks = "";
    },
    checkForms(input) {
      if (input["name"] && input["name"].length > 0) {
        return true;
      } else {
        return false;
      }
    },
    createItem() {
      document.getElementById("newItemForm").classList.add("was-validated");
      if (this.checkForms(this.newItem)) {
        this.newItemLoading = true;
        axios
          .post("/wishedgifts", this.newItem)
          .then((response) => {
            this.myList.push(response.data);
            this.newItem = {};
            this.newItemLoading = false;
            document
              .getElementById("newItemForm")
              .classList.remove("was-validated");
          })
          .catch((error) => {
            this.newItemLoading = false;
            error.function = "createItem";
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
    deleteItem(item) {
      axios
        .delete(`/wishedgifts/${item.id}`)
        .then(() => {
          this.myList.splice(this.myList.indexOf(item), 1);
        })
        .catch((error) => {
          error.function = "deleteItem";
          this.$emit("onError", error);
        });
    },
    editItem(item) {
      this.editingItem.name = item.name;
      this.editingItem.link = item.link;
      this.editingItem.id = item.id;
    },
    getMyList() {
      axios
        .get("/wishedgifts")
        .then((response) => {
          this.contentLoaded = true;
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
    needsWordWrap(items) {
      if (items === "") {
        return "";
      } else {
        return "text-nowrap";
      }
    },
    updateItem() {
      document.getElementById("editingItemForm").classList.add("was-validated");
      if (this.checkForms(this.editingItem)) {
        axios
          .patch(`/wishedgifts/${this.editingItem.id}`, this.editingItem)
          .then(() => {
            document
              .getElementById("editingItemForm")
              .classList.remove("was-validated");
            var foundItem = this.myList.find(
              (item) => item.id === this.editingItem.id
            );

            foundItem.name = this.editingItem.name;
            foundItem.link = this.editingItem.link;
          })
          .catch((error) => {
            error.function = "updateItem";
            this.$emit("onError", error);
          });
      }
    },
  },
};
</script>
