using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        

       
        [HttpGet]
        public async Task<ActionResult<List<Domain.Activity>>> GetActivities(){
            return await Mediator.Send(new ListR.Query());

        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Domain.Activity>> GetActivity(Guid id)
        {

            return await Mediator.Send(new Details.Query{Id=id});


        }
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return Ok(await Mediator.Send(new Create.Command{Activity=activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id=id;
            return Ok(await Mediator.Send(new EditItem.Command{Activity=activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeeleteActivity(Guid id)
        {
            return Ok(await Mediator.Send(new DeleteItem.Command{Id=id}));
        }
      
    }
}