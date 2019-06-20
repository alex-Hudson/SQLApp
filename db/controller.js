import { axios } from "axios";

export default class RestServer {
  getData() {
    const url = `localhost/data`;
    axios
      .get(url)
      .then(response => response.data)
      .then(data => {
        this.setState({ users: data });
        console.log(this.state.users);
      });
  }
}
