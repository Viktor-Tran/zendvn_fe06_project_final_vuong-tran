$(function () {
  let getFavoriteVideo = JSON.parse(localStorage.getItem("NEW_PLAYLIST"));
  let message = $(".message");

  if (getFavoriteVideo === null) {
    message.text("Chưa có video");
    message.addClass("error__message");
    message.show(500, "linear");
    return;
  }
  renderPlaylistFavorite(getFavoriteVideo);

  //DELEGATE
  $(document).on("click", ".card__play--video", function () {
    let id = $(this).data("id");
    showModal(id);

    $(".my__modal").modal({
      fadeDuration: 400,
    });
  });

  $(document).on("click", ".btn-dislike", function () {
    let id = $(this).data("id");
    let itemAfterRemove = removeItem(id);
    renderPlaylistFavorite(itemAfterRemove);
  });

  //FUNCTION

  function removeItem(id) {
    getFavoriteVideo = getFavoriteVideo.filter((item) => item.id !== id);
    localStorage.setItem("NEW_PLAYLIST", JSON.stringify(getFavoriteVideo));
    return getFavoriteVideo;
  }
  function showModal(id) {
    let generate = getFavoriteVideo.filter((item) => item.id === id)[0];

    let regular = new RegExp(/"(\/\/www.*?)"/, "gmi");
    let iframeStr = generate.iframe;
    let regularMatches = iframeStr.match(regular);

    let render = `<iframe src=${regularMatches[0]} class="video--item"  frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
  </iframe>`;

    $(".video--item").html(render);
  }

  function renderPlaylistFavorite(data) {
    let content = "";
    data.map((item) => {
      let thumbnail = JSON.parse(item.thumbnail);
      let statist = checkValid(item.statistics);
      content += `
      <div class="col-xl-4">
      <div class="tab-pane fade show active" id="tab-${
        item.playlist_id
      }" role="tabpanel" aria-labelledby="${item.playlist_id}-tab">
        <div class="row">
          <div class="item col-xl-12 col-sm-6">
            <div class="card rounded-pill border-0">
              <div class="card__cover card-img-top ">
                <img src=${thumbnail.high.url} alt="">
                <a class="card__play 
                card__play--video
               " 
                href="#my__modal"
                ref="modal:open"
                data-id="${item.id}">
                <i class="icon ion-ios-play"></i>
                </a>
              </div>
              <div class="card-body ">
                <div class="card__content">
                  <h3 class="card__title">
                    <p>
                      ${item.title}
                    </p>
                  </h3>
                </div>
                  <div class='row justify-content-xl-center '>
                    <div class='col-xl-12 '>
                      <ul class="card__meta--index">
                        <li>
                          <span class="d-flex justify-content-xl-start justify-content-sm-center content__meta">Ngày đăng:
                            ${formatDate(item.published_at)}
                          </span>
                        </li>
                        <li>
                          <span class="d-flex justify-content-xl-start justify-content-sm-center content__meta">Cập nhật ngày:
                            ${formatDate(item.updated_at)}
                          </span>
                        </li>
                        <li>
                          <span class="card__view d-flex justify-content-xl-start justify-content-sm-center content__meta">Lượt xem:
                            <i class="icon ion-ios-eye"></i>
                            ${statist.viewCount}
                          </span>
                        </li>
                        <li>
                          <span class = 'card__like d-flex justify-content-xl-start justify-content-sm-center content__meta'>Lượt thích:
                            <i class="icon ion-ios-thumbs-up"></i>
                            ${statist.likeCount}
                          </span>
                        </li>
                      </ul>
                    </div>
                </div>
              </div>
              <div class="card-footer details__wrapper-dislike">
                <button data-id=${
                  item.id
                } class='btn btn-dislike'>Bỏ yêu thích<i class='icon ion-ios-heart-dislike'></i></button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
                  `;
    });

    $(".list__favorite--item").html(content);
  }

  function checkValid(data) {
    let check = "";
    data === undefined ? check : (check = JSON.parse(data));
    return check;
  }

  function formatDate(stringDate) {
    let newDate = new Date(stringDate);
    newDate = `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
    return newDate;
  }
});
