
<template>
  <div>
    <ul
      v-for="item in folder"
      :key="item.id"
    >
      <li>
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
      </li>
      <Filetree
        v-if="item.type=='folder'"
        :folder="item.objects"
      />
    </ul>
  </div>
</template>

<script>
export default {
	name: 'Filetree',
	props: {
		folder: Array
	}
}
</script>

<style lang="scss" scoped>
  ul {
    margin: 0;

    li {
      display: flex;
      list-style-type: none;

      span {
        display: inline-block;
        margin-right: .2em;

        .material-icons {
          font-size: 20px;
        }
      }

      .fileName {
        flex: 1;
      }
    }
  }
</style>
