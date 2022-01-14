$(function () {
  let getPlayListFromLocal = localStorage.getItem("PLAYLIST_VIDEO");

  let title = $(".details__title");
  let description = $(".card__description--details");
  let rate = $(".card__rate");
  let thumbnail = $(".image-thumbnail");
  let publishDate = $(".card__publish");
  let update = $(".card__update");
  let viewCount = $(".card__view");
  let likeCount = $(".card__like");
  let videoPlayer = $("#player");
  let btnLike = $(".details__wrapper-like");
  let message = $(".message");
  // let btnLike = $('.btn-like');

  if (getPlayListFromLocal === null) {
    window.location.assign("404.html");
  } else {
    let dataPlayList;
    try {
      dataPlayList = JSON.parse(getPlayListFromLocal);
    } catch (error) {
      console.log(error);
    }

    //SHOW FIRST VIDEO
    renderContent(dataPlayList[0]);

    // SHOW ALL VIDEO
    renderTable(dataPlayList);

    //DELEGATE
    $(document).on("click", ".accordion--item", function () {
      let id = $(this).data("id");
      dataPlayList.map((item) => {
        if (item.id === id) {
          renderContent(item);
        }
      });
    });

    $(document).on("click", ".btn-like", function () {
      let id = $(this).data("id");

      let newPlaylist = [];

      let newPlaylistItem = dataPlayList.filter((item) => item.id === id);
      
      if (!localStorage.getItem("NEW_PLAYLIST")) {
        newPlaylist = [...newPlaylist, ...newPlaylistItem];
        localStorage.setItem("NEW_PLAYLIST", JSON.stringify(newPlaylist));
        showMessageSuccess(message)
        return
      }

      newPlaylist = JSON.parse(localStorage.getItem("NEW_PLAYLIST"));

      let checkValid = checkValidNewPlaylist(newPlaylist, id);

      if (!checkValid) {
        message.text("Video đã tồn tại trong yêu thích");
        if (message.hasClass("success__message")) {
          message.removeClass("success__message");
          message.addClass("error__message");
        }
        message.addClass("error__message");
        message.show(500, "linear");
        return;
      }
      
      newPlaylist = [...newPlaylist, ...newPlaylistItem];
      localStorage.setItem("NEW_PLAYLIST", JSON.stringify(newPlaylist));
      showMessageSuccess(message)
    });
  }

  function showMessageSuccess(message) {
    message.text("Đã thêm video vào yêu thích");
    message.removeClass("error__message");
    message.addClass("success__message");
    message.show(500, "linear");
    message.hide(2000);
  }

  function checkValidNewPlaylist(array, id) {
    let flag = true;
    array.forEach((element) => {
      // console.log(element.id)
      if (element.id === id) {
        flag = false;
      }
    });
    return flag;
  }

  function renderContent(data) {
    let ifr = data.iframe;
    let statistics = JSON.parse(data.statistics);
    let image = JSON.parse(data.thumbnail);

    title.text(data.title);
    description.text(data.description);
    publishDate.html(formatDate(data.published_at));
    update.html(formatDate(data.updated_at));
    rate.html(`<i class="icon ion-ios-star"></i>${statistics.likeCount}`);
    thumbnail.attr({
      src: `${image.medium.url}`,
      width: `${image.medium.width}` + "px",
      height: `${image.medium.height}` + "px",
    });
    viewCount.html(`<i class="icon ion-ios-eye"></i>${statistics.viewCount}`);
    likeCount.html(
      `<i class="icon ion-ios-thumbs-up"></i>${statistics.likeCount}`
    );
    videoPlayer.html(ifr);
    btnLike.html(
      `<button data-id=${data.id} class='btn btn-like'>Yêu thích<i class='icon ion-ios-heart'></i></button>`
    );
  }

  function renderTable(data) {
    let content = "";
    data.map((item) => {
      content += `
      <tr data-id=${item.id} class="accordion--item">
        <th>${item.id}</th>
        <td>${item.title}</td>
        <td>${formatDate(item.published_at)}</td>
			</tr>`;
    });
    $(".table__accordion").html(content);
  }

  function formatDate(stringDate) {
    let newDate = new Date(stringDate);
    newDate = `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
    return newDate;
  }
});
