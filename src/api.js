/**
 * API Calls
 */
class API {
  
  constructor () { 
    this.api = "https://saldometrobus.yizack.com/api";
  }

  async getTarjeta (num_tarjeta) {
    const response = await fetch(`${this.api}/tarjeta/${num_tarjeta}`);
    if (response.ok) {
      return response.json();
    }
    else {
      return { status: "error" };
    }
  }
  
}

export default new API();
