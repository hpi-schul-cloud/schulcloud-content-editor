
<template>
  <div>
    <ul
      v-for="item in folder"
      :key="item.id"
    >
      <li :class="{validEntry: !value['deleted'].includes(item.id), strikethrough: value['deleted'].includes(item.id)}">
        <span v-if="item.type=='folder'">
          <i class="material-icons">
            folder_open
          </i>
        </span>
        <span v-if="item.type=='file'">
          <i class="material-icons">
            insert_drive_file
          </i>
        </span>
        <span class="fileName">
          {{ item.name }}
        </span>
        <span
          class="close"
          @click="deleteEntry(item)"
        >
          <i class="material-icons">
            close
          </i>
        </span>
        <span
          class="restore"
          @click="restoreEntry(item)"
        >
          <i class="material-icons">
            restore_page
          </i>
        </span>
      </li>
      <Filetree
        v-if="item.type=='folder'"
        :folder="item.objects"
        :value="value"
        :is-parent-deleted="isParentDeleted"
      />
    </ul>
  </div>
</template>

<script>
export default {
	name: 'Filetree',
	props: {
		folder: Array,
		value: Object,
		isParentDeleted: Boolean
	},
	data: () => {
		return {
			isDeleted: []
		}
	},
	watch: {
		isParentDeleted: function (from, to) {
			if (to == true) {
				this.deleteEntry()
			} else {

			}
		}
	},
	methods: {
		deleteEntry (item) {
			/* console.log(item.id);
      this.isDeleted[item.id] = true;
      this.$forceUpdate();
      console.log(this.isDeleted);
      if (item.type =='folder'){
        item.objects.forEach((child)=>{
          this.deleteEntry(event, child);
          this.$forceUpdate();
        })
      }*/
			console.log(this.value['deleted']);
			this.value['deleted'].push(item.id);
			this.$forceUpdate();
			console.log(this.value['deleted']);
			this.$emit('input', this.value);
			this.isParentDeleted = true;
		},
		restoreEntry (event, item) {
			let deltedArray = this.value['deleted']
			console.log(deltedArray);
			deltedArray.splice(deltedArray.indexOf(item.id), 1);
			console.log(deltedArray);
			this.$forceUpdate();
			this.$emit('input', this.value);
			this.isParentDeleted = false;
		}
	}
}
</script>

<style lang="scss" scoped>
  ul {
    margin: 0;

    li {
      display: flex;
      list-style-type: none;

      &:hover {
        cursor: pointer;
        background: #eee;
      }

      span {
        display: flex;
        align-items: center;
        margin: .2em .2em .2em 0;

        .material-icons {
          font-size: 20px;
        }
      }

      .fileName {
        flex: 1;
      }

      .close {
        display: none;
      }

      .restore {
        display: none;
      }
    }

    .validEntry:hover .close {
      display: flex;
    }

    .strikethrough {
      color: red;

      &:hover .restore {
        display: flex;
      }

      .fileName {
        text-decoration: line-through;
      }
    }
  }
</style>
