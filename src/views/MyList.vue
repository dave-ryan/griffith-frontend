<template>
  <div class="container">
    <div v-if="!loaded">
      <img src="../assets/images/loading.gif" alt="" />
    </div>
    <transition>
      <div v-if="loaded">
        <div class="mb-5">
          <h2 class="mt-2 mb-5">Your Christmas List</h2>

          <table class="table table-striped table-responsive">
            <thead class="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Wished gift</th>
                <th scope="col">Link</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in myList"
                :key="item.id"
                class="align-middle"
              >
                <th scope="row">{{ index + 1 }}</th>
                <td class="text-truncate" style="max-width: 150px">
                  {{ item.name }}
                </td>
                <td class="text-truncate" style="max-width: 150px">
                  <a
                    v-if="item.link"
                    :href="`//` + item.link.replace(/^https?:\/\//, '')"
                    alt=""
                    target="_blank"
                    >{{ item.link }}</a
                  >
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-outline-success"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                    @click="editItem(item)"
                  >
                    Edit
                  </button>
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
        <hr />
        <button
          type="button"
          class="btn btn-outline-success p-4"
          data-bs-toggle="modal"
          data-bs-target="#batchModal"
        >
          Add multiple items to your list at once
        </button>
        <hr />
        <div class="row">
          <div class="col"></div>
          <div class="col-md-8 col-12">
            <form
              @submit.prevent="createItem"
              id="newItemForm"
              class="mt-5 mb-4"
              novalidate
            >
              <h5 class="mb-3">New item for your Christmas List:</h5>
              <div class="input-group mb-3">
                <span class="input-group-text">Name/description of item</span>
                <input
                  type="text"
                  v-model="newItem.name"
                  class="form-control"
                  required
                />
                <div class="invalid-feedback">
                  What do you want for Christmas?
                </div>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text">
                  Online shopping link (optional)
                </span>
                <input
                  type="text"
                  v-model="newItem.link"
                  class="form-control"
                />
              </div>
              <button class="btn btn-success" type="submit">
                Add this to your list
              </button>
            </form>
          </div>
          <div class="col"></div>
        </div>
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
                    Editing: {{ editingItem.name }}
                  </h3>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div class="modal-body">
                  <div class="input-group mb-3">
                    <span class="input-group-text"
                      >Name/description of item</span
                    >
                    <input
                      type="text"
                      v-model="editingItem.name"
                      class="form-control"
                      required
                    />
                    <div class="invalid-feedback">
                      What do you want for Christmas?
                    </div>
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text">
                      Online shopping link (optional)
                    </span>
                    <input
                      type="text"
                      v-model="editingItem.link"
                      class="form-control"
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
                    Save changes
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
                Are you sure you want to delete "{{ deletingItem.name }}" from
                your wishlist?
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
                  Delete the item
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
                <h4 class="col fw-bold text-center mt-2">
                  Add Items One Line At A Time
                </h4>
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
                  <div class="col-6">
                    <div class="input">
                      <h4>
                        <label for="floatingTextarea-Gift" class="fw-bold"
                          >Wished For</label
                        >
                      </h4>
                      <textarea
                        class="form-control batch"
                        :class="needsWordWrap(batchItems)"
                        placeholder="Socks&#10;Throw pillows&#10;Any Marvel movie on Bluray"
                        id="floatingTextarea-Gift"
                        v-model="batchItems"
                      ></textarea>
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
                        class="form-control batch"
                        :class="needsWordWrap(batchLinks)"
                        placeholder="amazon.com/socks&#10;&#10;www.google.com/marvel-blurays"
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
                  Add all items!
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
.container {
  padding-top: 80px;
}
.form-control.batch {
  min-height: 50vh;
}
</style>

<script>
import axios from "axios";
export default {
  data() {
    return {
      myList: [],
      newItem: {},
      editingItem: {},
      deletingItem: {},
      loaded: false,
      batchItems: "",
      batchLinks: "",
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
    getMyList: function () {
      axios
        .get("/wishedgifts")
        .then((response) => {
          this.loaded = true;
          this.myList = response.data;
        })
        .catch((errors) => {
          console.log("errors: ", errors.response.data.errors);
          if (errors.response.status === 401) {
            this.$root.logOut();
          }
        });
    },
    editItem: function (item) {
      this.editingItem.name = item.name;
      this.editingItem.link = item.link;
      this.editingItem.id = item.id;
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
    needsWordWrap: function (items) {
      if (items === "") {
        return "";
      } else {
        return "text-nowrap";
      }
    },
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
  },
};
</script>