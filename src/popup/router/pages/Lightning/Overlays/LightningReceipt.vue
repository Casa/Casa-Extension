<template>
  <div class="receipt">
    <div class="receipt-header">
      <h3>Lightning Payment Receipt</h3>
      <h6>Saved to Transaction History</h6>
    </div>
    <div class="receipt-details">
      <!-- Transaction Date -->
      <div class="d-flex flex-row justify-content-between align-items-baseline">
        <div class="receipt-label">Date</div>
        <div class="receipt-value">
          <div class="container-fluid date-container">
            <div class="row justify-content-around align-items-stretch">
              <div class="date-badge col d-flex flex-column justify-content-center">
                <div class="row">
                  <div class="col"><span class="month">Aug</span></div>
                </div>
                <div class="row">
                  <div class="col"><span class="day">23</span></div>
                </div>
              </div>
              <div class="date-time col d-flex flex-column justify-content-center"><span>11:32PM</span></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Recipient -->
      <div class="d-flex flex-row justify-content-between align-items-baseline">
        <div class="receipt-label">To</div>
        <div class="receipt-value">hotpockets</div>
      </div>
      <!-- Amount -->
      <div class="d-flex flex-row justify-content-between align-items-baseline">
        <div class="receipt-label">Sending</div>
        <div class="receipt-value">0.00153499 <span class="btc-heartbeat">BTC</span></div>
      </div>
      <div class="d-flex flex-row justify-content-end"><div class="receipt-value">$13.26</div></div>
      <!-- Expiration -->
      <div class="d-flex flex-row justify-content-between align-items-baseline">
        <div class="receipt-label">Expires</div>
        <div class="receipt-value">11:32PM</div>
      </div>
      <!-- New Balance -->
      <div class="d-flex flex-row justify-content-between align-items-baseline">
        <div class="receipt-label">Lightning Balance</div>
        <div class="receipt-value">0.00153499 <span class="btc-heartbeat">BTC</span></div>
      </div>
      <div class="d-flex flex-row justify-content-end"><div class="receipt-value">$36.26</div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: `LightningReceipt`,
};
</script>

<style lang="scss" scoped>
.receipt-label {
  opacity: 0.4;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: 1px;
  color: #0a0525;
  text-transform: uppercase;
}

.receipt-value {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  color: #0a0525;
}

.receipt-header {
  position: relative;
  max-width: 42em;
  margin: 0 auto;
  padding: 1em;
  color: #0a0525;
  border-bottom: 3px solid #f5f5f5;

  h3 {
    font-size: 24px;
    font-weight: 900;
    color: #0a0525;
  }

  h6 {
    opacity: 0.5;
    font-size: 18px;
    font-weight: 500;
    color: #0a0525;
  }
}

.receipt-details {
  position: relative;
  max-width: 42em;
  margin-right: auto;
  margin-left: auto;
  padding: 1em;
  color: #0a0525;
}

.receipt-details .justify-content-between {
  margin: 1.25rem 0 0 0;
  align-items: baseline !important;
}

.date-container {
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid #d7d8d9;
}

.date-badge span {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
}

.date-badge {
  max-width: 45px;
  max-height: 45px;
  padding-left: 0;
  padding-right: 0;
  border-radius: 9.5px;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.date-badge .col {
  padding-left: 0;
  padding-right: 0;
}

.date-badge .month {
  font-size: 10px;
  font-weight: 900;
  text-align: center;
  color: #8d8e8e;
  margin-top: 3px;
}

.date-badge .day {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: #0a0525;
  margin-top: -2px;
}

.date-time {
  font-size: 15px;
  text-align: center;
  color: #0a0525;
  border-left: 1px solid #d7d8d9;
  padding-left: 10px;
}
</style>
