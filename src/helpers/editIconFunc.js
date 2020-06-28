module.exports = {
  editIcon: function(storyUser, loggerUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggerUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  }
}