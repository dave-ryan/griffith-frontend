<template>
  <div class="container-fluid ps-0 pe-0 mt-5 mb-5 text-center">
    <Splash
      :src="splashSrc"
      :contentLoaded="contentLoaded"
      :splashLoaded="splashLoaded"
      :lowPresentCount="false"
      @loadSplash="this.splashLoaded = true"
    />
    <transition name="content">
      <div v-if="contentLoaded && splashLoaded" class="ps-3 pe-3 mt-5">
        <div class="row">
          <div class="col"></div>
          <div class="col-lg-10">
            <div class="table-responsive">
              <h2 class="mt-2 mb-5">Your Christmas List</h2>
              <table class="table table-striped">
                <thead class="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Wished Gift</th>
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
              <h5 class="mb-2">New Item For Your Christmas List</h5>
              <label class="input-group-text">Name/Description</label>
              <div class="input-group mb-2">
                <input
                  type="text"
                  v-model="newItem.name"
                  class="form-control"
                  required
                  id="newItemName"
                />
                <div class="invalid-feedback">
                  What Do You Want For Christmas?
                </div>
              </div>
              <label class="input-group-text">
                Online Shopping Link&nbsp;
                <span class="fw-light"> (optional) </span>
              </label>
              <div class="input-group mb-2">
                <input
                  type="text"
                  v-model="newItem.link"
                  class="form-control"
                  id="newItemLink"
                />
              </div>
              <button class="btn btn-success" type="submit">
                Add This To Your List
              </button>
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
          Add Multiple Items To Your List At Once
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
                  <label class="input-group-text" for="editName"
                    >Name/Description</label
                  >
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      v-model="editingItem.name"
                      class="form-control"
                      required
                      id="editName"
                    />
                    <div class="invalid-feedback">
                      What Do You Want For Christmas?
                    </div>
                  </div>
                  <label class="input-group-text" for="editLink">
                    Online Shopping Link&nbsp;
                    <span class="fw-light"> (optional) </span>
                  </label>
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      v-model="editingItem.link"
                      class="form-control"
                      id="editLink"
                    />
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
                    Save changes
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
                    If you have links, make sure they line up. See the example
                    below..
                  </div>
                </div>
                <div class="row">
                  <div class="col-6 pe-1">
                    <div class="input">
                      <h4>
                        <label for="floatingTextarea-Gift" class="fw-bold"
                          >Wished For</label
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
                          >Links</label
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
.row {
  --bs-gutter-x: 0;
}
textarea {
  white-space: pre-wrap;
}
</style>

<script>
import axios from "axios";
import Splash from "../components/Splash.vue";

export default {
  components: { Splash },
  data() {
    return {
      myList: [],
      newItem: {},
      editingItem: {},
      deletingItem: {},
      contentLoaded: false,
      batchItems: "",
      batchLinks: "",
      splashLoaded: false,
      splashSrc: "/img/presents-cropped-compressed.160ef660.jpg",
      pageLoaded: false,
    };
  },
  computed: {
    isDisabled: function () {
      if (!this.newItem.name || this.newItem.name === "") {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.getMyList();
  },
  methods: {
    batchCreate: function () {
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
            .catch((errors) => {
              console.log("errors: ", errors.response.data.errors);
            });
        }
      }
      this.batchItems = "";
      this.batchLinks = "";
    },
    checkForms: function (input) {
      if (input["name"] && input["name"].length > 0) {
        return true;
      } else {
        return false;
      }
    },
    createItem: function () {
      document.getElementById("newItemForm").classList.add("was-validated");
      if (this.checkForms(this.newItem)) {
        axios
          .post("/wishedgifts", this.newItem)
          .then((response) => {
            this.myList.push(response.data);
            this.newItem = {};
            document
              .getElementById("newItemForm")
              .classList.remove("was-validated");
          })
          .catch((errors) => {
            console.log("errors: ", errors.response.data.errors);
          });

        setTimeout(() => {
          window.scrollTo(
            0,
            document.body.scrollHeight || document.documentElement.scrollHeight
          );
        }, 400);
      }
    },
    deleteItem: function (item) {
      axios
        .delete(`/wishedgifts/${item.id}`)
        .then(() => {
          this.myList.splice(this.myList.indexOf(item), 1);
        })
        .catch((errors) => {
          console.log("errors: ", errors.response.data.errors);
        });
    },
    editItem: function (item) {
      this.editingItem.name = item.name;
      this.editingItem.link = item.link;
      this.editingItem.id = item.id;
    },
    getMyList: function () {
      axios
        .get("/wishedgifts")
        .then((response) => {
          this.contentLoaded = true;
          this.pageLoaded = true;
          this.myList = response.data;
        })
        .catch((errors) => {
          console.log("errors: ", errors.response.data.errors);
          if (errors.response.status === 401) {
            this.$root.logOut();
          }
        });
    },
    needsWordWrap: function (items) {
      if (items === "") {
        return "";
      } else {
        return "text-nowrap";
      }
    },
    updateItem: function () {
      document.getElementById("editingItemForm").classList.add("was-validated");
      if (this.checkForms(this.editingItem)) {
        axios
          .patch(`/wishedgifts/${this.editingItem.id}`, this.editingItem)
          .then(() => {
            var foundItem = this.myList.find(
              (item) => item.id === this.editingItem.id
            );

            foundItem.name = this.editingItem.name;
            foundItem.link = this.editingItem.link;
          })
          .catch((errors) => {
            console.log("errors: ", errors.response.data.errors);
          });
      }
    },
  },
};
</script>
