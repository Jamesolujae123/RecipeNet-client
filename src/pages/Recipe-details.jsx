import React from "react";
import Jollof from "../assets/Jollof-d.jpg";
import Fishroll from "../assets/Fishroll-d.jpg";
import Meatpie from "../assets/Meatpie-d.jpg";
import "./Recipe.css";
import { FaStar } from "react-icons/fa6";
import { MdOutlineStarBorder } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";
import cocktail from "../assets/cocktail-s.jpg";
import eggs from "../assets/eggs-s.jpg";
import salad from "../assets/salad-s.jpg";
import pizza from "../assets/pizza-s.jpg";
import egg from "../assets/eggs-i.jpg";
import cocao from "../assets/cocao-i.jpg";
import plates from "../assets/plates-i.jpg";
import steak from "../assets/steak-i.jpg";
import { FaInstagram } from "react-icons/fa";
import { useState, useEffect } from "react";
import profile from "../assets/Ellipse 38.png";
import { FaRegStar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useConfirm } from "material-ui-confirm";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "@orrisroot/react-html-parser";
import { Toaster, toast } from "sonner";
import { useContext } from "react";
import { Welcome, AppContext, UserL } from "../AppContext";
import config from "../../config";
import Placeholder from "../assets/Placeholder-web.jpg";

const Recipe = () => {
  const [search, setSearch] = useState("");
  const [foodd, setFoodd] = useState(null);
  const [edit, setEdit] = useState(false);
  const [writeRev, setWriteRev] = useState(false);
  const [isTokenAvailable, setIsTokenAvailable] = useState(false);
  const confirm = useConfirm();
  const [reviews, setReviews] = useState(null);
  const { id } = useParams();

  const baseUrl = "https://recp-backend.onrender.com";

  const token = localStorage.getItem("token");

  const userLastName = localStorage.getItem("user_lastName");

  const headers = { Authorization: `Bearer ${token}` };

  const navigateTo = useNavigate();

  const GetApost = async () => {
    console.log(id);
    const response = await axios.get(`${config.baseUrl}/recipes/${id}`);
    setFoodd(response?.data);
    console.log(response);
  };

  const GetReviews = async () => {
    const response = await axios.get(`${config.baseUrl}/recipes/${id}/reviews`);
    console.log(response.data);
    setReviews(response.data);
  };

  // const getUserData = async () => {
  //   const userData = await axios.get(`${config.baseUrl}/user`, {
  //     headers,
  //   });

  //   if (userData.status === 200) {
  //     console.log(userData);
  //     setUserInfo(userData.data);
  //   } else {
  //     // console.log("An error occured");
  //     // localStorage.setItem("user_id", "");
  //   }

  const sendReview = async (e) => {
    e.preventDefault();
    const data = {
      recipe_id: `${id}`,
      description: `${review.description}`,
      rate: `${review.rating}`,
    };
    const sendPost = await axios.post(
      `${config.baseUrl}/recipes/${foodd?.id}/reviews`,
      data,
      {
        headers,
      }
    );

    if (sendPost.status === 200) {
      console.log("review sent Successfully");
      toast.success("review sent Successfully");

      GetReviews();
    }
  };

  useEffect(() => {
    GetApost();
    GetReviews();
  }, []);

  const uid = localStorage.getItem("user_id");

  const welc = useContext(Welcome);
  const data = useContext(AppContext);
  const usr = useContext(UserL);

  if (token) {
    welc.setWelcome(true);
    data.setIsLoggedin(true);
    usr.setUserLN(userLastName);
  }

  const handleReview = (e) => {
    const { name, value } = e.target;
    setReview((prevVal) => ({ ...prevVal, [name]: value }));
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(search);
  };

  const deleteAPost = async (e) => {
    e.preventDefault();
    await confirm({
      title: "Delete Recipe",
      description: "Are you sure you want to delete this recipe?",
      confirmationText: "Yes, delete it",
      cancellationText: "Cancel",
    })
      .then(() =>
        axios.delete(`${config.baseUrl}/recipes/${foodd?.id}`, {
          headers,
        })
      )
      // Only runs if user clicks "OK"
      .catch(
        (
          err // This runs if user clicks "Cancel"
        ) => (
          console.log("Deletion cancelled", err),
          toast.error("Deletion cancelled")
        )
      );
  };

  const toEditPage = () => {
    navigateTo(`/EditR/${foodd?.id}`);
  };

  const EditReview = async () => {};

  const [review, setReview] = useState({
    recipe_id: `${id}`,
    description: "",
    rate: null,
  });

  const colors = {
    Orange: "#FF8A5A",
    grey: "#a9a9a9",
  };

  return (
    <div className="details">
      <div className="d-cont">
        <div className="wrapper">
          <img
            className="meat"
            src={!foodd?.image_url ? `${Placeholder}` : `${foodd?.image_url}`}
            alt=""
          />
        </div>
        <div className="d-det">
          <div className="ini">
            <div className="bars"></div>
            <div className="bap-name">
              <div className="f-tiill">
                <p>{foodd?.food_name}</p>
                <p className="Aut">
                  {foodd?.User.first_name} {foodd?.User.last_name}
                </p>
              </div>
              <div className="star-options-cont">
                <span className="d-stars">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <MdOutlineStarBorder />
                </span>
                <div>
                  {foodd?.user_id == uid ? (
                    <div className="options-cont">
                      <button className="eb" onClick={toEditPage}>
                        Edit
                      </button>
                      <form action="">
                        <button className="del-b" onClick={deleteAPost}>
                          Delete
                        </button>
                      </form>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="inin">
            <div className="d-content">
              <p className="contttt">{foodd?.description}</p>
            </div>
            <div className="d-ingre">
              <p className="ig">Ingredients</p>
              <span className="inggg">
                {ReactHtmlParser(foodd?.ingredients)}
              </span>
            </div>
            <div className="d-method">
              <p className="pp">Preparation</p>
              <p className="methhh">{ReactHtmlParser(foodd?.preparation)}</p>
            </div>
          </div>
          <div className="recipe-video">
            <div>
              <span className="recp-head">Video</span>{" "}
            </div>
            <iframe
              className="recipe-vid"
              src={`${foodd?.video_url}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen="true"
            />
          </div>
        </div>
        {token ? (
          <div>
            <div className="blog-r">
              <div className="review-hd">
                <span className="star">
                  <FaRegStar />
                </span>
                <span className="hd-text">Reviews & Rating</span>
              </div>
              <div className="review-cont">
                {edit ? (
                  <div className="review-cont">
                    <div className="rev">
                      <h3 className="rev-title">Edit review</h3>

                      <form onSubmit={sendReview} className="rev-form">
                        <textarea
                          className="review-ting"
                          cols={30}
                          rows={10}
                          value={review.description}
                          name="description"
                          id=""
                          onChange={handleReview}
                        ></textarea>
                        <input
                          name="rating"
                          className="rat"
                          value={review.rating}
                          type="text"
                          placeholder="rating"
                          onChange={handleReview}
                        />
                        <button className="rev-sb">Submit</button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div>
                    {reviews?.map((blob) => (
                      <div className="review-blo" key={blob}>
                        <div className="author-info">
                          <div>
                            <img src={profile} alt="" />
                            <span className="auth">
                              {blob.user.first_name}
                              {""} {""}
                              {blob.user.last_name}
                            </span>
                          </div>
                          <div className="auth-cont">
                            <div className="author-tings">
                              <div className="top-cont">
                                {blob?.user_id == uid ? (
                                  <div className="options-cont">
                                    {/* <button className="eb" onClick={EditReview}>
                                  Edit
                                </button> */}
                                    <form action="">
                                      <button
                                        className="del-b"
                                        onClick={async (e) => {
                                          e.preventDefault();

                                          const del = await axios.delete(
                                            `${config.baseUrl}/reviews/${blob.id}`,
                                            {
                                              headers,
                                            }
                                          );
                                          if (del.status === 204) {
                                            toast.success(
                                              "Post deleted successfully"
                                            );
                                            GetAllPosts();
                                          }
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </form>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>{" "}
                            <div className="author-container">
                              <span className="date">
                                Date:{" "}
                                <span className="d">
                                  {blob.updatedAt.slice(0, 10)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="review-conti">
                          <div className="stars">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <MdOutlineStarBorder />
                          </div>
                          <div className="b-cont">{blob.description}</div>
                        </div>
                      </div>
                    ))}{" "}
                  </div>
                )}
              </div>
            </div>

            <div className="add-review-cont">
              <div className="rev">
                <h3 className="rev-title">Write a review</h3>

                <form onSubmit={sendReview} className="rev-form">
                  <textarea
                    className="review-ting"
                    cols={30}
                    rows={10}
                    value={review.description}
                    name="description"
                    id=""
                    onChange={handleReview}
                  ></textarea>
                  <input
                    name="rating"
                    className="rat"
                    value={review.rating}
                    type="text"
                    placeholder="rating"
                    onChange={handleReview}
                  />
                  <button className="rev-sb">Submit</button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="fixed">
        <div>
          <form className="top-ting" onSubmit={handleSubmit}>
            <input
              onChange={handleChange}
              className="wh-s"
              type="search"
              placeholder="Keywords"
            />
            <p className="wh">All Categories</p>
            <button className="sr">Search Now</button>
          </form>
        </div>
        <div className="catege">
          <div className="cataeg-1">
            <div>
              <div className="side-img">
                <img className="cataeg-img" src={cocktail} alt="" />
              </div>
              <div>
                <p className="categ-pi">Cocktails</p>
              </div>
            </div>
            <div>
              <div className="side-img">
                <img className="cataeg-img" src={eggs} alt="" />
              </div>
              <div>
                <p className="categ-pi">eggs</p>
              </div>
            </div>
          </div>
          <div className="cataeg-1">
            <div>
              <div className="side-img">
                <img className="cataeg-img" src={salad} alt="" />
              </div>
              <div>
                <p className="categ-pi">salad</p>
              </div>
            </div>
            <div>
              <div className="side-img">
                <img className="cataeg-img" src={pizza} alt="" />
              </div>
              <div>
                <p className="categ-pi">pizza</p>
              </div>
            </div>
          </div>
        </div>
        <div className="insta">
          <div>
            <p className="inst">
              {" "}
              <FaInstagram className="inst-pic" /> Instagram
            </p>
          </div>

          <div className="inta-c">
            <div>
              <img className="int" src={cocao} alt="" />
            </div>
            <div>
              <img className="int" src={egg} alt="" />
            </div>
          </div>
          <div className="inta-c">
            <div>
              <img className="int" src={plates} alt="" />
            </div>
            <div>
              <img className="int" src={steak} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
