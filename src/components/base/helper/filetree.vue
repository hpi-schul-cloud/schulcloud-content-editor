
<template>
  <div>
    <ul
      v-for="item in folderEntries"
      :key="item.id"
    >
      <li v-if="item.type === 'file'">
        <FiletreeEntry
          :id="item.id"
          icon="insert_drive_file"
          :name="item.name"
          :is-deleted="deletedObjects.includes(item.id)"
          @delete="deleteFile"
          @restore="restoreFile"
        />
      </li>

      <template v-if="item.type === 'folder'">
        <li>
          <FiletreeEntry
            :id="item.id"
            icon="folder_open"
            :name="item.name"
            :is-deleted="deletedObjects.includes(item.id)"
            @delete="deleteFolder"
            @restore="restoreFolder"
          />
        </li>
        <li>
          <Filetree
            v-if="item.type=='folder'"
            :folder-entries="item.objects"
            :value="value"
            :is-deleted="deletedObjects.includes(item.id)"
          />
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import FiletreeEntry from "./FiletreeEntry.vue"
export default {
  name: 'Filetree',
  components:{
    FiletreeEntry
  },
  props: {
    folderEntries: {
      type: Array,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      deletedObjects: []
    }
  },
  watch: {
    isDeleted: function (to, from) {
      if(to === from){ return; }
      console.log("isDeleted changed", to)
      if (to === true) {
        console.log("delete items", this.folderEntries);
        this.folderEntries.forEach((item) => {
          if(item.type === "file"){
            this.deleteFile(item.id);
          }
          if(item.type === "folder"){
            this.deleteFolder(item.id);
          }
        });
      } else {
        console.log("restore items", this.folderEntries);
        this.folderEntries.forEach((item) => {
          if(item.type === "file"){
            this.restoreFile(item.id);
          }
          if(item.type === "folder"){
            this.restoreFolder(item.id);
          }
        });
      }
      console.log("updated objects", this.deletedObjects);
    }
  },
  methods: {

    deleteFile(id){
      this.deletedObjects.push(id);
    },
    restoreFile(id){
      this.deletedObjects.splice(this.deletedObjects.indexOf(id), 1);
    },

    deleteFolder(id){
      this.deletedObjects.push(id);
    },
    restoreFolder(id){
      this.deletedObjects.splice(this.deletedObjects.indexOf(id), 1);
    },
/*

    updateParentDeletedHandler(value){
      this.isParentDeleted = value;
      this.$emit("isParentDeleted", value);
    },
    deleteEntry (item) {
      if(item.type === "file"){
        this.value['deleted'].push(item.id);
      }
      this.deletedObjects[item.id] = true;
      this.$forceUpdate();
      this.$emit('input', this.value);
    },
    restoreEntry (item) {
      console.log("restore...", item);

      this.$emit("updateParentDeleted", false);

      let deltedArray = this.value['deleted'];
      if(item.type === "file"){
        deltedArray.splice(deltedArray.indexOf(item.id), 1);
      }

      this.deletedObjects[item.id] = false;
      console.log(deltedArray);

      console.log("restored!");
      this.$forceUpdate();
      this.$emit('input', this.value);
    }
  */
  }
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding-left: 1.5rem;
  li {
    list-style-type: none;
  }
}
</style>
