import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './Mapp.css';

const urlDiscoverBase = 'https://api.themoviedb.org/3/discover/movie';
const urlMovieBase = 'https://api.themoviedb.org/3/movie/';



class Movie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idmovie: null,
            movieData: {},
            genres: [],
            crew: [],
            moveRate: []
        }

    }
    async componentDidMount() {
        console.log(this.state.movieData);
        let linkRout = this.props.match.params.id;
        let pos = linkRout.indexOf('-');
        let link = linkRout.slice(0, pos)
        // parseInt(rate, 10)
        this.setState({ idmovie: link })
        try {
            let urlMovie = urlMovieBase + link + '?api_key=9ef25729616af857b530f9b1aea7392b&language=es';
            const response = await axios.get(urlMovie);
            this.setState({
                movieData: response.data
            });
            console.log(response.data);
            let urlCredits = urlMovieBase + link + '/credits?api_key=9ef25729616af857b530f9b1aea7392b&language=es'
            const response2 = await axios.get(urlCredits);
            console.log(response2);
            this.setState({
                movieData: { ...this.state.movieData, cast: response2.data.cast, crew: response2.data.crew }
            });
            console.log(this.state.movieData);
            const movieDetail = this.state.movieData;
            this.setState({ genres: movieDetail.genres });
            this.setState({ crew: movieDetail.crew });
            const response3 = await axios({
                method: 'get',
                url: 'https://api.themoviedb.org/3/account/' + localStorage.getItem('idusu') + '/rated/movies',
                params: {
                    api_key: '9ef25729616af857b530f9b1aea7392b',
                    session_id: localStorage.getItem('session')
                }
            });
            console.log(response3);
            if (response3) {
                let dataRating = response3.data.results.map(x => { return { id: x.id, rating: x.rating } });
                this.setState({ moveRate: { ...dataRating } });
                console.log(this.state.moveRate);
            }
            // let moveRate = Object.values(this.state.moveRate);
            // let movieDataD = this.state.movieData.id;
            // let starfill = document.querySelector(".filled-stars");
            // if (starfill) {
            //     if (moveRate) {
            //         // console.log(moveRate[0].id + '///'+this.state.movieData.id + 'existe!!!!!!gaaa');
            //         for (let i = 0; i < moveRate.length; i++) {
            //             console.log('Entro al buclleeee');
            //             if (moveRate[i].id === movieDataD) {////////////////////////////////
            //                 let rate = moveRate[i].rating * 10
            //                 starfill.style.width = rate + '%';
            //                 console.log('heeeyy444' + moveRate[i].rating);
            //             }
            //         }
            //     }
            // }
            // let rating = document.querySelector(".rating-stars");
            // rating.addEventListener('mouseover', function (e) {

            //     e.stopPropagation();
            //     let starfill = document.querySelector(".filled-stars");
            //     if (starfill) {
            //         if (moveRate) {
            //             // console.log(moveRate[0].id + '///'+this.state.movieData.id + 'existe!!!!!!gaaa');
            //             for (let i = 0; i < moveRate.length; i++) {
            //                 console.log('Entro al buclleeeedadadada');
            //                 if (moveRate[i].id === movieDataD) {////////////////////////////////
            //                     let rate = moveRate[i].rating * 10
            //                     starfill.style.width = rate + '%';
            //                     console.log('heeeyy444' + starfill.style.width);
            //                 }
            //             }
            //         }
            //     }
            // }, true);
            // rating.addEventListener('click', function (e) {
            //     e.stopPropagation();
            //     let starfill = document.querySelector(".filled-stars");
            //     if (starfill) {
            //         if (moveRate) {
            //             // console.log(moveRate[0].id + '///'+this.state.movieData.id + 'existe!!!!!!gaaa');
            //             // for (let i = 0; i < moveRate.length; i++) {
            //             //     console.log('Entro al buclleeeedadadada');
            //             //     if (moveRate[i].id === movieDataD) {////////////////////////////////
            //             //         let rate = moveRate[i].rating * 10
            //             //         starfill.style.width = rate + '%';
            //             //         console.log('heeeyy444' + starfill.style.width);
            //             //     }
            //             // }
            //             let rate = starfill.style.width;
            //             let rate2 = parseInt(rate, 10) * 10;
            //             this.setState({
            //                 moveRate: { ...moveRate, rating: rate2 }
            //             });
            //         }
            //     }
            // }, true);


        } catch (e) {
            console.log(e);
        }
    }
    date() {
        const movieDetail = this.state.movieData;
        if (movieDetail.runtime !== 0.0) {
            console.log('hey');
            const date = (Math.floor(movieDetail.runtime / 60)) + "h " + (movieDetail.runtime % 60) + "m";
            return (
                <span>{date}</span>
            );
        }
        else {
            console.log('heynoo');
            return null;
        }
    }
    crew() {
        let crew = this.state.crew.filter(
            x => (x.department === 'Writing'
                || x.department === 'Directing')
        );
        let crewKey = new Set();
        for (let i = 0; i < crew.length; i++) {
            crewKey.add(crew[i].id);
        }
        let crewArray = [...crewKey];
        console.log(crewArray);
        let listCrew = [];
        for (let j = 0; j < crewArray.length; j++) {
            let id = crewArray[j];
            let rols = '';
            let name = new Set();
            for (let h = 0; h < crew.length; h++) {
                if (crew[h].id === id) {
                    name.add(crew[h].name);
                    rols += crew[h].job + ',';
                }
            }
            listCrew.push({ id: id, name: [...name].toString(), rols: rols });
        }
        let crewFinal = listCrew.map(x => {
            return (
                <li className="profile">
                    <p>
                        <Link to={"/person/" + x.id + "+" + x.name.replaceAll(' ', '+')}>
                            {x.name}
                        </Link>
                    </p>
                    <p className="character">
                        {x.rols}
                    </p>
                </li>
            );
        }
        );
        return crewFinal;
    }
    click = async (e) => {
        try {
            e.stopPropagation();
            let starfill = document.querySelector(".filled-stars");
            console.log("Entro al clik");
            // console.log("Enviado Rating" + e.target.style.width + 'dada');
            // let rate = parseInt( e.target.style.width, 10) / 10;
            let rate = parseInt(starfill.style.width, 10) / 10;
            console.log(rate);
            await axios({
                method: 'post',
                url: 'https://api.themoviedb.org/3/movie/' + this.state.movieData.id + '/rating',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                params: { api_key: '9ef25729616af857b530f9b1aea7392b', session_id: localStorage.getItem('session') },
                data: { value: rate }
            });
            const editRate = Object.values(this.state.moveRate).map((x) => {
                if (x.id === this.state.movieData.id) {
                    return { ...x, rating: rate }
                }
                return x;
            });
            console.log(editRate);
            this.setState({ moveRate: editRate });
        }
        catch (e) {
            console.log(e);
        }
    }
    moveRate = (e) => {
        e.stopPropagation();
        let rating = document.querySelector(".rating-stars");
        let starfill = document.querySelector(".filled-stars");
        let parentOffSet = rating.offsetLeft;
        let posx = e.pageX - parentOffSet;
        var widthBox = rating.offsetWidth / 10;

        let withstar = Math.ceil(posx / widthBox) * 10;
        console.log(posx + 'de' + withstar + 'da' + widthBox);
        starfill.style.width = withstar + '%';
    }
    overRate = (e) => {
        e.stopPropagation();
        let movieDataD = this.state.movieData.id;
        let moveRate = Object.values(this.state.moveRate);
        let starfill = document.querySelector(".filled-stars");
        // console.log(moveRate[0].id + '///'+this.state.movieData.id + 'existe!!!!!!gaaa');
        for (let i = 0; i < moveRate.length; i++) {
            console.log('Entro al buclleeeedadadada');
            if (moveRate[i].id === movieDataD) {////////////////////////////////
                let rate = moveRate[i].rating * 10
                starfill.style.width = rate + '%';
                console.log('heeeyy444' + starfill.style.width);
            }
        }
    }
    render() {
        let starfill = document.querySelector(".filled-stars");
        let movieDataD = this.state.movieData.id;
        if (starfill) {
            let moveRate = Object.values(this.state.moveRate);
            console.log('Entro al buclleeee de carga');
            if (moveRate) {
                console.log('Entro al buclleeee de carga');
                // console.log(moveRate[0].id + '///'+this.state.movieData.id + 'existe!!!!!!gaaa');
                for (let i = 0; i < moveRate.length; i++) {
                    console.log('Entro al buclleeee de carga');
                    if (moveRate[i].id === movieDataD) {////////////////////////////////
                        let rate = moveRate[i].rating * 10
                        starfill.style.width = rate + '%';
                        console.log('heeeyy444' + moveRate[i].rating);
                    }
                }
            }
        }
        const movieDetail = this.state.movieData;
        let genres = this.state.genres;
        const mDGenres = genres.map(x => {
            const ref = '/genre/' + x.id + '-' + x.name + '/movie';
            return (
                //     <Link to={"/movie/" + props.id + "+" + props.title.replaceAll(' ', '+')}>
                //     <img src={props.src} alt={props.title}></img>
                // </Link>
                <a href={ref}>{x.name}</a>
            )
        });
        let average;
        if (movieDetail.vote_average !== 0) {
            average = (movieDetail.vote_average) * 10;
        }
        else {
            average = "NR";
        }
        return (
            <div className="container2" >
                <div className="img-content">
                    <img alt={movieDetail.title} src={"https://image.tmdb.org/t/p/w500/" + movieDetail.poster_path}></img>
                </div>
                <div className="info-content">
                    <div className="head-info">
                        <h2>
                            {movieDetail.title}
                        </h2>
                        <span>{movieDetail.release_date}</span>
                        <span>{mDGenres}</span>
                        {this.date()}
                    </div>
                    <div className="review-content">
                        <p>{average}</p>
                    </div>
                    <h3>Tu valoracion</h3>
                    <div className="rating-stars" onClick={(e) => this.click(e)}
                        onMouseMove={(e) => this.moveRate(e)}
                        onMouseOver={(e) => this.overRate(e)}>
                        <span className="empty-stars">
                            <span className="star">
                                <i className="icon star-empty"></i>
                            </span>
                            <span className="star">
                                <i className="icon star-empty"></i>
                            </span>
                            <span className="star">
                                <i className="icon star-empty"></i>
                            </span>
                            <span className="star">
                                <i className="icon star-empty"></i>
                            </span>
                            <span className="star">
                                <i className="icon star-empty"></i>
                            </span>
                        </span>
                        <span className="filled-stars" >
                            <span className="stars">
                                <i className="icon start"></i>
                            </span>
                            <span className="stars">
                                <i className="icon start"></i>
                            </span>
                            <span className="stars">
                                <i className="icon start"></i>
                            </span>
                            <span className="stars">
                                <i className="icon start"></i>
                            </span>
                            <span className="stars">
                                <i className="icon start"></i>
                            </span>
                        </span>
                    </div>
                    <div class="data-info">
                        <p className="tagline">{movieDetail.tagline}</p>
                        <h3>Sinopsis</h3>
                        <p>{movieDetail.overview}</p>
                        <ol className="list-crew">{this.crew()}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

function Card(props) {
    return (
        <article className="card-movie">

            <div className="img">
                <Link to={"/movie/" + props.id + "-" + props.title.replaceAll(' ', '-')}>
                    <img src={props.src} alt={props.title}></img>
                </Link>
            </div>
            <div className="content" >
                <h2>{props.title}</h2>
                <p>{props.date}</p>
            </div>

        </article>
    );
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            session: null
        }
    }
    async componentDidMount() {
        try {
            const intiliaze = async () => {
                console.log(this.state.movies);
                const urlCurrent = urlDiscoverBase + "?api_key=9ef25729616af857b530f9b1aea7392b&with_genres=18&language=es";
                const response = await axios.get(urlCurrent);
                this.setState({ movies: response.data.results })
                console.log(urlCurrent);
            }
            intiliaze();
            if (!localStorage.getItem('token')) {
                console.log('helloo!!');
                const session = async () => {
                    const tokenURL = 'https://api.themoviedb.org/3/authentication/token/new?api_key=9ef25729616af857b530f9b1aea7392b';
                    const response = await axios.get(tokenURL);
                    let token = response.data.request_token;
                    localStorage.setItem('token', token);
                    // window.open('https://www.themoviedb.org/authenticate/' + token, 'heigth=200,width=150')
                    window.location.href = 'https://www.themoviedb.org/authenticate/' + token + '?redirect_to=http://localhost:3000/';
                    console.log(token);
                };
                session();
            }
            if (!localStorage.getItem('session')) {
                console.log(localStorage.getItem('token'));
                console.log(this.state.session);
                const newSession = async () => {
                    try {
                        const sessionURL = 'https://api.themoviedb.org/3/authentication/session/new?api_key=9ef25729616af857b530f9b1aea7392b';
                        // const response = await axios.post(sessionURL, {
                        //     data :{
                        //         request_token: localStorage.getItem('token')
                        //     }
                        // });
                        const response = await axios({
                            method: 'post',
                            url: sessionURL,
                            headers: {},
                            data: {
                                request_token: localStorage.getItem('token').toString()
                            }
                        });
                        console.log(response);
                        let getSession = response.data.session_id;
                        localStorage.setItem('session', getSession);
                        this.setState({
                            session: getSession
                        });
                        console.log(getSession);
                    } catch (e) {
                        console.log(e);
                    }
                };
                newSession();

            }
            const count = async () => {
                const acountURL = 'https://api.themoviedb.org/3/account';
                let response = await axios({
                    method: 'get',
                    url: acountURL,
                    params: {
                        api_key: '9ef25729616af857b530f9b1aea7392b',
                        session_id: localStorage.getItem('session')
                    }
                });
                localStorage.setItem('idusu', response.data.id);
            }
            count();
        } catch (e) {
            console.log(e);
        }

    }


    render() {
        let listMovies = this.state.movies.map(x => {
            return <Card
                id={x.id}
                src={"https://image.tmdb.org/t/p/w342/" + x.poster_path}
                title={x.title}
                date={x.release_date} sesion={this.state.sesion} />
        });

        return (
            <Router>
                <Route path="/" exact>
                    <div className="wrapper" >
                        <main>
                            <div className="controls">
                                <form>
                                    <label htmlFor="sCategoria">Genero</label>
                                    <select defaultValue="ninguno" name="Generos" id="sGenre" className=".sGenre">
                                        <option>--selecionar categoria--</option>
                                    </select>
                                    <button type="submit">Buscar</button>
                                </form>
                            </div>
                            <section>
                                {listMovies}
                            </section>
                        </main>
                    </div>
                </Route>
                <Route path="/movie/:id" component={Movie} />
            </Router>
        );
    }

}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);