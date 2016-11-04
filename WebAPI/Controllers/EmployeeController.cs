using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using eHR.Repository;

namespace eHR.Web.WebAPI.Controllers
{
    /*
    To add a route for this controller, merge these statements into the Register method of the WebApiConfig class. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using eHR.Repository;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Employee>("Employee");
    builder.EntitySet<Department>("Department"); 
    config.Routes.MapODataRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EmployeeController : ODataController
    {
        private Entities db = new Entities();

        // GET odata/Employee
        [Queryable]
        public IQueryable<Employee> GetEmployee()
        {
            return db.Employee;
        }

        // GET odata/Employee(5)
        [Queryable]
        public SingleResult<Employee> GetEmployee([FromODataUri] int key)
        {
            return SingleResult.Create(db.Employee.Where(employee => employee.ID == key));
        }

        // PUT odata/Employee(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != employee.ID)
            {
                return BadRequest();
            }

            db.Entry(employee).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employee);
        }

        // POST odata/Employee
        public async Task<IHttpActionResult> Post(Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Employee.Add(employee);
            await db.SaveChangesAsync();

            return Created(employee);
        }

        // PATCH odata/Employee(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Employee> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Employee employee = await db.Employee.FindAsync(key);
            if (employee == null)
            {
                return NotFound();
            }

            patch.Patch(employee);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employee);
        }

        // DELETE odata/Employee(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Employee employee = await db.Employee.FindAsync(key);
            if (employee == null)
            {
                return NotFound();
            }

            db.Employee.Remove(employee);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/Employee(5)/Department
        [Queryable]
        public SingleResult<Department> GetDepartment([FromODataUri] int key)
        {
            return SingleResult.Create(db.Employee.Where(m => m.ID == key).Select(m => m.Department));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeExists(int key)
        {
            return db.Employee.Count(e => e.ID == key) > 0;
        }
    }
}
