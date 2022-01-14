$(function () {
  let BASE_API_URL = "http://apiforlearning.zendvn.com/api/";
  let btnNextSlide = $(".home__nav--next");
  let btnPrevSlide = $(".home__nav--prev");
  let btnShowMore = $(".section__btn");
  let stepSession = 0;

  //Array Latest course
  let arrayPositionLatest = [1, 3, 4, 5];
  let arrayPositionPremiere = [8, 9, 10, 11, 12, 13];
  let arrayPositionPopular = [3, 16, 15, 17, 22, 21];
  btnPrevSlide.addClass("disable");
  btnPrevSlide.addClass("disable__element");

  //Render first time
  getPlayList(arrayPositionLatest);
  getPlayList(arrayPositionPremiere);

  getPlayListVideo(arrayPositionPopular);
  getPlayListVideo(arrayPositionPopular, arrayPositionPopular[0]);

  //Set length stepSession
  stepSession = arrayPositionLatest.length;
  btnNextSlide.click(function () {
    stepSession++;
    if (0 <= stepSession && stepSession <= 78) {
      btnPrevSlide.removeClass("disable");
      btnPrevSlide.removeClass("disable__element");
      btnPrevSlide.addClass("enable__element");
      getPlayList(arrayPositionLatest, stepSession, arrayPositionLatest.length);
    } else {
      btnNextSlide.addClass("disable");
      btnNextSlide.addClass("disable__element");
    }
  });

  btnPrevSlide.click(function () {
    stepSession--;
    getPlayList(arrayPositionLatest, stepSession, arrayPositionLatest.length);
    if (stepSession === 0) {
      btnPrevSlide.removeClass("enable__element");
      btnPrevSlide.addClass("disable__element");
      btnPrevSlide.addClass("disable");
    }
  });

  btnShowMore.click(function () {
    stepSession += 6;
    console.log(stepSession);
    if (0 <= stepSession && stepSession <= 64) {
      getPlayList(
        arrayPositionLatest,
        stepSession,
        arrayPositionPremiere.length
      );
    } else {
      btnShowMore.addClass("disable");
      btnShowMore.addClass("disable__element");
    }
  });

  //DELEGATE
  $(document).on("click", ".card__play--video", function () {
    let id = $(this).data("id");
    getVideoById(id);

    $(".my__modal").modal({
      fadeDuration: 400,
    });
  });

  $(document).on("click", ".card__play--playlist", function (e) {
    let id = $(this).data("id");
    getPlaylistById(id);
    $(".my__modal-lg").modal("hide");
  });

  $(document).on("click", ".card__title--link", function () {
    let id = $(this).data("id");
    getVideoById(id);
  });

  $(document).on("click", ".nav-link", function () {
    let id = $(this).data("id");
    localStorage.setItem("NAV__TAB", id);
    getPlayListVideo(arrayPositionPopular, id);
  });

  //FUNCTION

  function getPlayList(arr, offset, limit) {
    let configData = {
      offset,
      limit,
      sort_by: "id",
      sort_dir: "asc",
    };
    $.ajax({
      type: "GET",
      url: BASE_API_URL + "playlists",
      data: configData,
      beforeSend: function () {
        let renderLoading = "";
        if (limit === 4) {
          renderLoading = ".list__season--item";
        } else {
          renderLoading = ".list__premiere--item";
        }
        $(renderLoading).html(
          `
          <i class="fas fa-spinner fa-pulse fa-5x loading"></i>
          `
        );
      },
      complete: function (jqXHR, status) {
        if (status == "success" || status == "notmodified") {
          let getResponse = JSON.parse(jqXHR.responseText);

          if (offset === undefined && limit === undefined) {
            let result = getResponse.filter((item) => arr.includes(item.id));
            // renderCategory(result);
            renderPlaylistSession(result);
          } else {
            renderPlaylistSession(getResponse);
          }
        }
      },
    });
  }

  function getPlayListVideo(arr, id) {
    let urlRender =
      id !== undefined
        ? BASE_API_URL + "playlists/" + id + "/videos"
        : BASE_API_URL + "playlists";
    let configData = {
      offset: 0,
      limit: arr.length,
      sort_by: "id",
      sort_dir: "asc",
    };
    $.ajax({
      type: "GET",
      url: urlRender,
      data: id !== undefined ? configData : { sort_by: "id", sort_dir: "asc" },
      beforeSend: function () {
        let renderLoading = "";
        renderLoading = "#myTabContent";
        $(renderLoading).html(
          `
          <i class="fas fa-spinner fa-pulse fa-5x loading"></i>
          `
        );
      },
      complete: function (jqXHR, status) {
        if (status == "success" || status == "notmodified") {
          let getResponse = JSON.parse(jqXHR.responseText);
          if (id) {
            renderPlaylistPopular(getResponse);
          } else {
            let getNavTab = localStorage.getItem("NAV__TAB");
            let result = getResponse.filter((item) => arr.includes(item.id));
            renderCategory(result);
            let getId = $(".nav-link").data("id");
            if (getNavTab !== null) {
              $(`#${getNavTab}-tab`).addClass("active show");
              getPlayListVideo(arr, getNavTab);
            } else {
              $(`#${getId}-tab`).addClass("active show");
            }
          }
        }
      },
    });
  }

  function renderPlaylistSession(data) {
    let content = "";

    if (data.length === 4) {
      data.map((item) => {
        let thumbnail = JSON.parse(item.thumbnail);
        content += `
              <div class="col-xl-3 col-sm-6">
                <div class="item">
                  <div class="card card--big">
                    <div class="card__cover">
                      <img src=${thumbnail.standard.url} alt="">
                      <a href="#" class="card__play card__play--playlist" data-id="${item.id}" >
                      <i class="icon ion-ios-play"></i>
                      </a>
                    </div>
                    <div class="card__content">
                      <h3 data-id="${item.id}"  class="card__title"><a href="#">${item.title}</a></h3>
                    </div>
                  </div>
                </div>
              </div>
              `;
      });

      $(".list__season--item").delay(500).html(content);
    } else {
      data.map((item) => {
        let thumbnail = JSON.parse(item.thumbnail);
        content += `
                <div class="col-6 col-sm-4 col-lg-3 col-xl-2">
                  <div class="item">
                    <div class="card__cover">
                      <img src=${thumbnail.standard.url} alt="">
                      <a href="#" class="card__play card__play--playlist" data-id="${item.id}" >
                        <i class="icon ion-ios-play"></i>
                      </a>
                    </div>
                    <div class="card__content">
                      <h3 data-id="${item.id}"  class="card__title"><a href="#">${item.title}</a></h3>
                    </div>
                  </div>
                </div>
                `;
      });
      $(".list__premiere--item").delay(500).html(content);
    }
  }

  function formatDate(stringDate) {
    let newDate = new Date(stringDate);
    newDate = `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
    return newDate;
  }

  function renderPlaylistPopular(data) {
    let content = "";
    data.map((item) => {
      let thumbnail = JSON.parse(item.thumbnail);
      let statist = checkValid(item.statistics);
      let renderClass =
        item.statistics === undefined
          ? `card__play--playlist`
          : "card__play--video";
      content += `
              <div class="col-xl-4">
                <div class="tab-pane fade show active" id="tab-${
                  item.playlist_id
                }" role="tabpanel" aria-labelledby="${item.playlist_id}-tab">
                  <div class="row">
                    <div class="item col-xl-12 col-sm-6">
                      <div class="card rounded-pill border-0">
                        <div class="card__cover card-img-top ">
                          <img src=${thumbnail.standard.url} alt="">
                          <a class="card__play 
                          ${renderClass}" 
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                  `;
    });

    $(".list__popular--item").html(content);
  }

  function checkValid(data) {
    let check = "";
    data === undefined ? check : (check = JSON.parse(data));
    return check;
  }

  function renderCategory(data) {
    let content = "";
    data.map((item) => {
      content += `
      <li class="nav-item">
        <a class='nav-link' data-id='${item.id}' id='${item.id}-tab' data-toggle="tab" href="#tab-${item.id}" role="tab" aria-controls="tab-${item.id}" aria-selected="true">
          ${item.title}
        </a>
      </li>`;
    });
    $(".nav-tabs").html(content);
  }

  function getVideoById(id) {
    const config = {
      offset: 0,
      limit: 1,
      sort_by: "id",
      sort_dir: "asc",
    };

    $.ajax({
      type: "GET",
      url: BASE_API_URL + "videos/" + id,
      data: config,
      success: function (response) {
        let regular = new RegExp(/"(\/\/www.*?)"/, "gmi");
        let iframeStr = response.iframe;
        let regularMatches = iframeStr.match(regular);

        let render = `<iframe src=${regularMatches[0]} class="video--item"  frameborder="0"
        	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        	allowfullscreen>
        </iframe>`;

        $(".video--item").html(render);
      },
    });
  }

  function getPlaylistById(id) {
    const config = {
      sort_by: "id",
      sort_dir: "asc",
    };
    $.ajax({
      type: "GET",
      url: BASE_API_URL + "playlists/" + id + "/videos",
      data: config,
      success: function (response) {
        console.log(id)
        redirectToDetailsPage("details.html", response);
      },
    });
  }

  function redirectToDetailsPage(url, data) {
    localStorage.setItem("PLAYLIST_VIDEO", JSON.stringify(data) || "[]");
    window.location.assign(url);
  }
});
