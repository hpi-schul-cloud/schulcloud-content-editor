
<template>
  <div>
    <ul
      v-for="item in folder"
      :key="item.id"
    >
      <li :class="{validEntry: !isDeleted[item.id], strikethrough: isDeleted[item.id]}">
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
          @click="deleteEntry($event, item.id)"
        >
          <i class="material-icons">
            close
          </i>
        </span>
        <span
          class="restore"
          @click="restoreEntry($event, item.id)"
        >
          <i class="material-icons">
            restore_page
          </i>
        </span>
      </li>
      <Filetree
        v-if="item.type=='folder'"
        :folder="item.objects"
        :class="{strikethrough: isDeleted[item.id]}"
      />
    </ul>
  </div>
</template>

<script>
export default {
	name: 'Filetree',
	props: {
		folder: Array
	},
	data: () => {
		return {
			isDeleted: []
		}
	},
	methods: {
		deleteEntry (event, id) {
			this.isDeleted[id] = true;
			this.$forceUpdate();
		},
		restoreEntry (event, id) {
			this.isDeleted[id] = false;
			this.$forceUpdate();
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
