import axios from "axios";

export class expenseService {
  static FREQUENT_URL = "http://localhost:8000/frequentRecords";
  static DAILY_URL = "http://localhost:8000/dailyRecords";

  // frequent records
  static getFrequentRecords() {
    return axios.get(this.FREQUENT_URL);
  }

  static addFrequentRecord(record) {
    return axios.post(this.FREQUENT_URL, record);
  }

  static updateFrequentRecord(id, record) {
    return axios.put(`${this.FREQUENT_URL}/${id}`, record);
  }

  static deleteFrequentRecord(id) {
    return axios.delete(`${this.FREQUENT_URL}/${id}`);
  }

  // daily records
  static getDailyRecords() {
    return axios.get(this.DAILY_URL);
  }

  static addDailyRecord(record) {
    return axios.post(this.DAILY_URL, record);
  }

  static updateDailyRecord(id, record) {
    return axios.put(`${this.DAILY_URL}/${id}`, record);
  }

  static deleteDailyRecord(id) {
    return axios.delete(`${this.DAILY_URL}/${id}`);
  }

  // daily summary (category-wise, for a given date)
  static async getDailySummary(date) {
    try {
      const res = await axios.get(this.DAILY_URL);
      const records = res.data[date] || {}; // get today's records only

      const summary = Object.values(records).reduce((acc, item) => {
        const cat = item.category || "misc";
        acc[cat] = (acc[cat] || 0) + Number(item.total);
        return acc;
      }, {});

      return summary;
    } catch (error) {
      console.error("Error in getDailySummary:", error);
      throw error;
    }
  }
}
