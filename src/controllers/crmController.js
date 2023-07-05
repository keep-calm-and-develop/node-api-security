import mongoose from 'mongoose';
import { ContactSchema } from '../models/crmModel';

const Contact = mongoose.model('Contact', ContactSchema);

export const addNewContact = async (req, res) => {
    let newContact = new Contact(req.body);

    try {
        const contact = await newContact.save();
        res.json(contact);
    } catch(error) {
        res.send(err);
    }
};

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.json(contacts);
    } catch(error) {
        res.send(error);
    }
};

export const getContactWithID = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId);
        res.json(contact);
    } catch(error) {
        res.send(error);
    }
}

export const updateContact = async (req, res) => {
    try {
        const updateContact = await Contact.findOneAndUpdate({ _id: req.params.contactId}, req.body, { new: true });
        res.json(updateContact);
    } catch(error) {
        res.send(error);
    }
}

export const deleteContact = async (req, res) => {
    try {
        const updateContact = await Contact.remove({ _id: req.params.contactId });
        res.json({ message: 'Successfully deleted contact'});
    } catch(error) {
        res.send(error);
    }
}