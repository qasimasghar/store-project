using System;
using System.Collections.Generic;

namespace Shop.ApiResponses
{
    public class ExchangeRateResponse
    {
        public Dictionary<string, double> Rates { get; set; }

        public string Base { get; set; }

        public DateTime Date { get; set; }
    }
}
